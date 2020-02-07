# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.
"""Periodic tasks for CMS."""

import os
import socket

import paramiko
from celery import shared_task
from flask import current_app

from cap.modules.experiments.utils.cadi import synchronize_cadi_entries

from ..errors import DASHarvesterException
from ..utils.common import kinit
from ..utils.das import cache_das_datasets_in_es_from_file


@shared_task
def synchronize_with_cadi():
    """Add/update CADI info in all cms-analysis, by syncing with CADI db."""
    synchronize_cadi_entries()


@shared_task(autoretry_for=(Exception, ),
             retry_kwargs={
                 'max_retries': 15,
                 'countdown': 10
             })
def harvest_das():
    """Harvest and index DAS datasets."""
    principal, kt = current_app.config['KRB_PRINCIPALS']['CADI']
    file_location = os.path.join(
        current_app.config['EXPERIMENTS_RESOURCES_LOCATION'], 'das.txt')

    @kinit(principal, kt)
    def _harvest_das_entries():
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())  # to fix
        ip = socket.gethostbyname('lxplus.cern.ch')

        ssh.connect(ip,
                    username='cernapcms',
                    auth_timeout=100,
                    look_for_keys=False,
                    gss_auth=True)

        _, stdout, stderr = ssh.exec_command('sh ~/private/test.sh')

        if stdout.channel.recv_exit_status() != 0:
            current_app.logger.error(
                'DAS harvesting failed during generating GRID certificate.\n'
                '{}'.format(stderr.read()))
            raise DASHarvesterException

        query = "dataset status=*"
        cmd = 'export EOS_MGM_URL=root://eosmedia.cern.ch;' \
              't=$(mktemp);' \
              'eos cp {file_location} {file_location}.backup;' \
              'dasgoclient -query="{query}" > $t && ' \
              'eos cp $t {file_location}; out=$?;' \
              'rm -f $t;' \
              'exit $out;'.format(file_location=file_location, query=query)

        _, stdout, stderr = ssh.exec_command(cmd)

        if stdout.channel.recv_exit_status() != 0:
            current_app.logger.error(
                'DAS harvesting failed during querying DAS client.\n'
                '{}'.format(stderr.read()))
            raise DASHarvesterException

        current_app.logger.info('File with latest DAS entries saved.')

    _harvest_das_entries()
    reindex_das_entries.delay()


@shared_task(autoretry_for=(Exception, ),
             retry_kwargs={
                 'max_retries': 10,
                 'countdown': 30
             })
def reindex_das_entries():
    """Reindex DAS entries in Elastic with the latest version."""
    file_location = os.path.join(
        current_app.config['EXPERIMENTS_RESOURCES_LOCATION'], 'das.txt')

    with open(file_location, 'r') as fp:
        source = (dict(name=line.strip()) for line in fp)
        cache_das_datasets_in_es_from_file(source)

    current_app.logger.info('DAS entries indexed succesfully.')
