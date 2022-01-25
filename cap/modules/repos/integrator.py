# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2022 CERN.
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
"""Repository Integration methods."""

from flask import current_app
from flask_login import current_user

from cap.modules.deposit.errors import FileUploadError
from .errors import GitError
from .factory import host_to_git_api, create_git_api
from .tasks import download_repo, download_repo_file
from .utils import populate_template_from_ctx, parse_git_url, create_webhook


def create_repo_as_collaborator_and_attach(record_uuid, data):
    from cap.modules.deposit.api import CAPDeposit
    record = CAPDeposit.get_record(record_uuid)
    config = record.schema.config.get('repositories', {})
    if not config:
        raise FileUploadError(
            'No config found. Cannot create a repo for this analysis.')

    host = data.get('host')
    git_service = host.split('.')[0]
    repos = config.get(git_service)

    token = current_app.config.get(repos['admin'])
    if not token:
        raise FileUploadError(f'Admin API key for {host} is not provided.')

    name = populate_template_from_ctx(record, repos.get('repo_name'))
    desc = populate_template_from_ctx(record, repos.get('description'))
    organization = repos.get('org_name')

    api = host_to_git_api(host)

    repo, invite = api.create_repo_as_collaborator(
        token, organization, name,
        description=desc,
        private=repos.get('private'),
        license=repos.get('license'),
        host=host
    )

    # get the url from the repo according to host
    url = repo.html_url if host == 'github.com' \
        else repo.attributes['web_url']

    # after the repo creation, attach it to the deposit
    host, owner, repo, branch, filepath = parse_git_url(url)
    api = create_git_api(
        host, owner, repo, branch,
        user_id=current_user.id
    )

    create_webhook(record_uuid, api)


def create_repo_as_user_and_attach(record_uuid, data):
    """Create a repository.

    Create a repository according to the parameters, and attach it to
    the current analysis.

    Expects json with params:
    * `host`: the git host, should be `github.com` or `gitlab.cern.ch`
    * `name`: the name of the new repo
    * `description`: a short repo description
    * `private`: true or false
    * `license`: the license type, should be string, or None
    * `org_name`: the organization name that should own the repo (the user
    should have access to it)
    """
    host = data.get('host')
    api = host_to_git_api(host)

    repo = api.create_repo_as_user(
        current_user.id,
        data.get('name'),
        description=data.get('description', ''),
        private=data.get('private', False),
        license=data.get('license'),
        org_name=data.get('org_name'),
        host=host
    )

    # get the url from the repo according to host
    url = repo.html_url if host == 'github.com' \
        else repo.attributes['web_url']

    # after the repo creation, attach it to the deposit
    host, owner, repo, branch, filepath = parse_git_url(url)
    api = create_git_api(
        host, owner, repo, branch,
        user_id=current_user.id
    )

    create_webhook(record_uuid, api)


def attach_repo_to_deposit(record_uuid, data):
    """Attach a repo to a deposit.
    
    Download the attached repo, and create webhooks
    according to the parameters.

    Can upload a repository or its single file and/or create a webhook.
    Expects json with params:
    * `url`: the git url, can point to repo or specific file
    * `download`: download the repo as a .tar and save it in the analysis
    * `webhook`: the webhook type to be applied, can be null to just `attach` the repo  # noqa
    """
    url = data.get('url')
    if not url:
        raise FileUploadError('Missing url parameter.')

    try:
        webhook = data.get('webhook')
        download = data.get('download')
        host, owner, repo, branch, filepath = parse_git_url(url)
        api = create_git_api(
            host, owner, repo, branch,
            user_id=current_user.id
        )

        # if filepath, download the file
        if filepath:
            if webhook:
                raise FileUploadError('You cannot create a webhook on a file')  # noqa

            download_repo_file(
                record_uuid,
                f'repositories/{host}/{owner}/{repo}/{api.branch or api.sha}/{filepath}',  # noqa
                *api.get_file_download(filepath),
                api.auth_headers
            )

        # if repo, we need to check the options, which work separately
        # we can just download, connect webhooks, both, or nothing at
        # all (so just attach the repo it to the record)
        else:
            # in any case, attach the repo to the record
            create_webhook(record_uuid, api)

            # if download, add the repo .tar in the files
            if download:
                download_repo.delay(
                    record_uuid,
                    f'repositories/{host}/{owner}/{repo}/{api.branch or api.sha}.tar.gz',  # noqa
                    api.get_repo_download(),
                    api.auth_headers)

            # if webhook, create webhook connection
            if webhook:
                if webhook == 'release' and branch:
                    raise FileUploadError(
                        'You cannot create a release webhook'
                        ' for a specific branch or sha.')

                if webhook == 'push' and not api.branch and api.sha:
                    raise FileUploadError(
                        'You cannot create a push webhook'
                        ' for a specific sha.')

                if webhook not in ['push', 'release']:
                    raise FileUploadError(
                        'Supported webhooks are push, release.')

                create_webhook(record_uuid, api, webhook)

    except GitError as e:
        raise FileUploadError(str(e))
