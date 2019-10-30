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

from flask import Blueprint, jsonify, request

from .api import GitAPI
from .errors import GitVerificationError
from .models import GitRepository, GitRepositorySnapshots
from .utils import verified_request, get_webhook_attrs


repos_bp = Blueprint('cap_repos',
                     __name__,
                     url_prefix='/repos'
                     )


@repos_bp.route('/event', methods=['POST'])
def get_webhook_event():
    """The route that webhooks will use to update the repo information."""
    event, serializer = get_webhook_attrs(request)

    # avoid the ping event from github on init
    if event == 'ping':
        return jsonify({'message': 'Ping event on init.'})

    payload = request.get_json()
    data = serializer.dump(payload).data
    ref = data['commit']['id']
    repo = GitRepository.get_by(data['repo_id'], branch=data['branch'])

    # make sure that the request is identified
    if not verified_request(request, repo):
        raise GitVerificationError('Could not verify the event from repo {}. '
                                   'No changes were made'
                                   .format(data['repo_id']))

    # 2 cases: we save just the metadata,
    # or update the saved file as well
    if repo.for_download:
        from cap.modules.repoimporter.fetcher import download_repo

        api = GitAPI.create(url=repo.url, user_id=repo.user_id)
        archived_repo_url = api.archive_repo_url(ref=api.last_commit)
        download_repo.delay(repo.recid, repo.repo_saved_name,
                            repo.url, archived_repo_url)

    GitRepositorySnapshots.create(event, data, repo, ref=ref)
    return jsonify({'message': 'Snapshot of repo saved.'})


@repos_bp.route('/<repo_id>/get-snapshots')
def get_repo_snapshots(repo_id):
    """Retrieve the list of changes, for a saved repo."""
    snapshots = GitRepositorySnapshots.query \
        .filter(GitRepositorySnapshots.repo.has(git_repo_id=repo_id)) \
        .all()

    snap_list = [dict(event=snap.event_type,
                      tag=snap.tag,
                      branch=snap.event_payload['branch'],
                      url=snap.download_url)
                 for snap in snapshots]

    return jsonify(snap_list)
