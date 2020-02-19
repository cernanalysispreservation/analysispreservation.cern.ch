# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
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
"""Git repositories views."""

from __future__ import absolute_import, print_function

from flask import Blueprint, abort, jsonify, request
from sqlalchemy.orm.exc import NoResultFound

from cap.modules.repoimporter.tasks import download_repo

from .factory import create_git_api
from .models import GitRepository, GitSnapshot, GitWebhook
from .serializers import payload_serializer_factory

repos_bp = Blueprint('cap_repos', __name__, url_prefix='/repos')


@repos_bp.route('/event', methods=['POST'])
def get_webhook_event():
    """The route that webhooks will use to update the repo information."""

    payload = request.get_json()
    serializer = payload_serializer_factory()

    if not serializer:
        abort(403)

    data = serializer.dump(payload).data

    try:
        repo = GitRepository.query.filter_by(external_id=data['repo_id'],
                                             branch=data['branch']).one()
        api = create_git_api(repo.host, repo.owner, repo.name, repo.branch)
        event = api.get_event_data()

        if event == 'ping':
            return jsonify({'message': 'Got it.'})

        webhook = GitWebhook.query.filter_by(event_type=event,
                                             repo_id=repo.id).one()
    except NoResultFound:
        abort(404)

    if not api.is_request_trusted(webhook.secret):
        abort(403)

    for subscriber in webhook.subscribers:
        # create api client with subscriber token
        api = create_git_api(repo.host, repo.owner, repo.name, repo.branch,
                             subscriber.user_id)
        host_without_protocol = repo.host.replace('https://', '')
        host_without_protocol = host_without_protocol.replace('http://', '')
        if subscriber.type == 'download':
            download_repo.delay(str(subscriber.record_id),
                                host_without_protocol, repo.owner, repo.name,
                                repo.branch, None, api.get_download_url())

    GitSnapshot.create(webhook, data)

    return jsonify({'message': 'Snapshot of repo saved.'})
