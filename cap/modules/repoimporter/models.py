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

"""Models for Git repositories and snapshots."""

from __future__ import absolute_import, print_function

from invenio_db import db
from invenio_accounts.models import User

from cap.types import json_type
from .utils import get_access_token


class GitRepository(db.Model):
    """Information about a GitHub repository."""

    __tablename__ = 'git_connected_repositories'
    __table_args__ = (db.UniqueConstraint('recid', 'git_repo_id', 'branch',
                                          name='unique_ids_constraint'),)

    id = db.Column(db.Integer, primary_key=True)
    git_repo_id = db.Column(db.Integer, unique=False, index=True)

    # CAP relations
    recid = db.Column(db.String(255), unique=False, nullable=False)
    repo_saved_name = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    user = db.relationship(User)

    # git specific attributes
    url = db.Column(db.String(255), nullable=False)
    host = db.Column(db.String(255), nullable=False)
    owner = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    branch = db.Column(db.String(255), nullable=False, default='master')

    # enable/disable the hook through this field (hook id)
    hook = db.Column(db.String(255), nullable=True)
    hook_secret = db.Column(db.String(32), nullable=True)

    # check if the repo should be downloaded every time an event occurs
    # do not remove create_constraint, sqlalchemy bug workaround
    for_download = db.Column(db.Boolean(create_constraint=False),
                             nullable=False, default=False)

    @classmethod
    def create_or_get(cls, git, data_url, user_id, record_id,
                      name=None, for_download=False):
        """Create a new repository instance, using the API information."""
        repo = cls.get_by(git.repo_id, branch=git.branch)

        if not repo:
            # avoid celery trouble with serializing
            user = User.query.filter_by(id=user_id).first()
            repo = cls(git_repo_id=git.repo_id,
                       host=git.host, owner=git.owner,
                       name=git.repo, branch=git.branch,
                       url=data_url,
                       recid=record_id,
                       user=user, user_id=user.id,
                       for_download=for_download,
                       repo_saved_name=name)
            db.session.add(repo)
            db.session.commit()

        return repo

    @classmethod
    def get_by(cls, repo_id, branch='master'):
        """Get a repo by its ID and branch if available."""
        return cls.query.filter(cls.git_repo_id == repo_id,
                                cls.branch == branch).first()

    def update_hook(self, hook_id=None, hook_secret=None):
        """Update the hook of the retrieved repo."""
        self.hook = hook_id
        self.hook_secret = hook_secret
        db.session.commit()

    def __repr__(self):
        """Get repository representation."""
        return '<Repository {self.name}: {self.git_repo_id}>'.format(self=self)


class GitRepositorySnapshots(db.Model):
    """Snapshot information for a Git repo."""

    __tablename__ = 'git_repository_snapshots'

    id = db.Column(db.Integer, primary_key=True)

    # webhook payload / event
    event_payload = db.Column(json_type, default={}, nullable=True)
    event_type = db.Column(db.String(255), nullable=False)

    # git specifics
    tag = db.Column(db.String(255), nullable=True)
    ref = db.Column(db.String(255), nullable=True)

    # foreign keys (connecting to repo and events)
    repo_id = db.Column(db.Integer, db.ForeignKey(GitRepository.id))
    repo = db.relationship(GitRepository)

    @staticmethod
    def create(event, data, repo, ref=None):
        snapshot = GitRepositorySnapshots(event_type=event, event_payload=data,
                                          tag=data['commit'].get('tag'),
                                          ref=ref, repo=repo)
        db.session.add(snapshot)
        db.session.commit()

    @property
    def download_url(self):
        if 'github' in self.repo.host:
            return 'https://codeload.github.com/{self.repo.owner}/' \
                   '{self.repo.name}/legacy.tar.gz/{self.ref}'\
                .format(self=self)
        else:
            token = get_access_token('GITLAB')
            return 'https://gitlab.cern.ch/api/v4/projects/' \
                   '{self.repo.git_repo_id}/repository/archive?' \
                   'sha={self.ref}&private_token={token}' \
                .format(self=self, token=token)

    def __repr__(self):
        """Get repository representation."""
        return """
        <Repository {self.repo.name}: {self.repo.git_repo_id}
         event:\t{self.event_type}
         tags:\t{self.tag}
         url:\t{self.url}
        """.format(self=self)
