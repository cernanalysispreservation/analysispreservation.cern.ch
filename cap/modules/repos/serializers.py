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

import pytz
from flask import request
from marshmallow import Schema, fields


class GitHubPayloadSchema(Schema):
    """Serializer for a GitHub webhook payload."""
    host = fields.Str(default='github.com')
    repo_id = fields.Str(attribute='repository.id', dump_only=True)
    branch = fields.Method('get_branch', dump_only=True)
    event_type = fields.Method('get_event_type', dump_only=True)

    author = fields.Method('get_author', dump_only=True)
    commit = fields.Method('get_commit', dump_only=True)
    release = fields.Method('get_release', dump_only=True)

    link = fields.Method('get_link', dump_only=True)

    def get_event_type(self, obj):
        """Event type (push|relase|not-supported)."""
        event_type = obj['X-Github-Event']
        if event_type == 'release' and obj.get('action') != 'released':
            event_type = 'not-supported'
        return event_type

    def get_author(self, obj):
        """Sender information."""
        return {
            'name': obj['sender']['login'],
            'id': obj['sender']['id'],
        }

    def get_branch(self, obj):
        """Branch information (only for push event)."""
        try:
            return obj['ref'].split('/')[-1]
        except KeyError:
            return

    def get_release(self, obj):
        """Release-event-specific information."""
        try:
            return {
                "tag": obj['release']['tag_name'],
                "name": obj['release']['name']
            }
        except KeyError:
            return

    def get_commit(self, obj):
        """Push-event-specific information."""
        try:
            return [{
                'id': head['id'],
                'message': head['message'],
                'added': head['added'],
                'removed': head['removed'],
                'modified': head['modified']
            } for head in obj['commits']]
        except KeyError:
            return

    def get_link(self, obj):
        """Link to github page."""
        if 'release' in obj:
            return obj['release']['html_url']
        elif 'commits' in obj:
            return obj['commits'][0]['url']
        else:
            return


class GitLabPayloadSchema(Schema):
    """Serializer for a GitLab webhook payload."""

    host = fields.Str(default='gitlab.cern.ch')
    repo_id = fields.Str(attribute='project_id', dump_only=True)
    branch = fields.Method('get_branch', dump_only=True)
    event_type = fields.Method('get_event_type', dump_only=True)

    author = fields.Method('get_author', dump_only=True)
    commit = fields.Method('get_commit', dump_only=True)
    release = fields.Method('get_release', dump_only=True)

    link = fields.Method('get_link', dump_only=True)

    def get_event_type(self, obj):
        """Event type (push|relase|not-supported)."""
        map_events = {
            'push': 'push',
            'tag_push': 'release',
        }
        return map_events.get(obj['event_name'], 'not-supported')

    def get_author(self, obj):
        """Sender information."""
        return {
            'name': obj['user_username'],
            'id': obj['user_id'],
        }

    def get_branch(self, obj):
        """Branch information (only for push event)."""
        if obj['event_name'] == 'push':
            return obj['ref'].split('/')[-1]

    def get_commit(self, obj):
        """Push-event-specific information."""
        if obj['event_name'] == 'push':
            try:
                return [{
                    'id': head['id'],
                    'message': head['message'],
                    'added': head['added'],
                    'removed': head['removed'],
                    'modified': head['modified']
                } for head in obj['commits']]
            except KeyError:
                return

    def get_link(self, obj):
        """Link to gitlab page."""
        if obj['event_name'] == 'tag_push':
            return f"{obj['project']['homepage']}" \
                   f"{obj['ref'].replace('refs','')}"
        else:
            try:
                return obj['commits'][0]['url']
            except (KeyError, IndexError):
                return

    def get_release(self, obj):
        """Release-event-specific information."""
        if obj['event_name'] == 'tag_push':
            return {
                'tag': obj['ref'].split('/')[-1],
                'name': obj['message'],
            }
        return


class GitSnapshotSchema(Schema):
    """Serializer for GitSnapshot model for UI."""
    payload = fields.Dict(dump_only=True)
    created = fields.Function(
        lambda obj: pytz.utc.localize(obj.created).isoformat(), dump_only=True)


class GitWebhookSubscriberSchema(Schema):
    """Serializer for GitWebhookSubscriber model for UI."""
    host = fields.Str(attribute='repo.host', dump_only=True)
    owner = fields.Str(attribute='repo.owner', dump_only=True)
    name = fields.Str(attribute='repo.name', dump_only=True)
    branch = fields.Str(attribute='webhook.branch', dump_only=True)

    event_type = fields.Str(attribute='webhook.event_type', dump_only=True)

    snapshots = fields.Nested(GitSnapshotSchema, many=True)


def payload_serializer_factory():
    """Return serializer instance based on a request type."""
    if 'X-Gitlab-Event' in request.headers.keys():
        return GitLabPayloadSchema()
    elif 'X-Github-Event' in request.headers.keys():
        return GitHubPayloadSchema()
    else:
        return None
