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
"""Serializers for git payloads."""

from __future__ import absolute_import, print_function

from flask import request
from marshmallow import Schema, fields


def get_commit(obj):
    """Retrieve the commit-specific information."""
    try:
        head = obj['commits'][0]
        return {
            'id': head['id'],
            'message': head['message'],
            'timestamp': head['timestamp'],
            'author': head['author'],
            'added': head['added'],
            'removed': head['removed'],
            'modified': head['modified']
        }
    except KeyError:
        return {}


def get_branch(obj):
    """Extract the branch name from the ref attribute."""
    return obj['ref'].split('/')[-1] if 'ref' in obj.keys() else 'master'


class GitHubPayloadSchema(Schema):
    """Serializer for a GitHub webhook payload."""
    hook_id = fields.Str(attribute='hook_id', dump_only=True)
    repo_id = fields.Str(attribute='repository.id', dump_only=True)
    repo_name = fields.Str(attribute='repository.name', dump_only=True)
    branch = fields.Function(get_branch, dump_only=True)
    ref = fields.Str(dump_only=True)

    sender = fields.Method('get_sender', dump_only=True)
    commit = fields.Function(get_commit, dump_only=True)

    def get_sender(self, obj):
        sender = obj['sender']
        return {'name': sender['login'], 'id': sender['id']}


class GitLabPayloadSchema(Schema):
    """Serializer for a GitLab webhook payload."""

    hook_id = fields.Str(attribute='hook_id', dump_only=True)
    repo_id = fields.Str(attribute='project_id', dump_only=True)
    repo_name = fields.Str(attribute='project.name', dump_only=True)
    event_type = fields.Str(attribute='event_name', dump_only=True)
    branch = fields.Function(get_branch, dump_only=True)
    ref = fields.Str(dump_only=True)

    sender = fields.Method('get_sender', dump_only=True)
    commit = fields.Function(get_commit, dump_only=True)

    def get_sender(self, obj):
        return {'name': obj['user_username'], 'id': obj['user_id']}


class GitSnapshotSerializerSchema(Schema):
    event = fields.Str(attribute='event_type', dump_only=True)
    tag = fields.Str(dump_only=True)
    branch = fields.Str(attribute='event_payload.branch', dump_only=True)
    url = fields.Str(attribute='download_url', dump_only=True)


def payload_serializer_factory():
    """Return serializer instance based on request type."""
    if 'X-Gitlab-Event' in request.headers.keys():
        return GitLabPayloadSchema()
    elif 'X-Github-Event' in request.headers.keys():
        return GitHubPayloadSchema()
    else:
        return None


git_snapshot_serializer = GitSnapshotSerializerSchema(many=True)
