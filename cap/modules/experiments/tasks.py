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

"""Cern Analysis Preservation tasks for Celery."""
import os
import subprocess

from celery import shared_task

from cap import config
from cap.modules.experiments.scripts.lhcb.lhcb import dump_analyses_to_json


@shared_task
def get_publications_files():
    path_to_script = os.path.join(config.APP_ROOT,
                                  'modules/experiments/scripts/lhcb/get_publications_files.sh')
    subprocess.call(path_to_script, shell=True)


@shared_task
def get_working_groups_files():
    path_to_script = os.path.join(config.APP_ROOT,
                                  'modules/experiments/scripts/lhcb/get_working_groups_files.sh')
    subprocess.call(path_to_script, shell=True)


@shared_task
def dump_lhcb_analyses_to_json():
    dump_analyses_to_json()
