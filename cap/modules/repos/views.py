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
"""Repositories module views."""

from __future__ import absolute_import, print_function

from flask import Blueprint, abort, jsonify, request
from invenio_db import db
from sqlalchemy.orm.exc import NoResultFound

from .errors import GitRequestWithInvalidSignature
from .factory import create_git_api
from .models import GitSnapshot, GitWebhook
from .serializers import payload_serializer_factory
from .tasks import download_repo

repos_bp = Blueprint('cap_repos', __name__, url_prefix='/repos')


@repos_bp.route('/event', methods=['POST'])
def get_webhook_event():
    """Endpoint for registered webhook events to send push notifications."""

    payload = request.get_json()
    payload.update(request.headers)  # info about type of event inside headers

    serializer = payload_serializer_factory(payload)
    if not serializer:
        abort(403)

    try:
        data = serializer.dump(payload).data
    except Exception:
        abort(400, 'Server was unable to serialize this request')

    if data["event_type"] == 'ping':
        return jsonify({'message': 'Got it.'})

    try:
        webhook = GitWebhook.query.filter_by(
            branch=data.get('branch'),
            event_type=data["event_type"],
        ).join(GitWebhook.repo).filter_by(
            external_id=data.pop('repo_id'),
            host=data.pop('host'),
        ).one()
    except NoResultFound:
        abort(404, 'This webhook was not registered in our system.')

    for subscriber in webhook.subscribers:
        api = create_git_api(webhook.repo.host, webhook.repo.owner,
                             webhook.repo.name, webhook.branch,
                             subscriber.user_id)
        try:
            api.verify_request(webhook.secret)
        except GitRequestWithInvalidSignature:
            abort(403)

        if webhook.branch:
            path = f'repositories/{api.host}/{api.owner}/{api.repo}/{webhook.branch}.tar.gz'  # noqa
        else:
            path = f'repositories/{api.host}/{api.owner}/{api.repo}.tar.gz'

        download_repo.delay(
            str(subscriber.record_id),
            path,
            api.get_repo_download(),
            api.auth_headers,
        )

        webhook.snapshots.append(GitSnapshot(payload=data))
        db.session.commit()

    return jsonify({'message': 'Snapshot of repository was saved.'})
