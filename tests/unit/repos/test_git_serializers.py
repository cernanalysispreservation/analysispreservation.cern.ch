# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2020 CERN.
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
"""Tests for git/webhook related serializers."""

from cap.modules.repos.models import GitSnapshot
from cap.modules.repos.serializers import GitWebhookSubscriberSchema


def test_webhook_subscriber_serializer(db, github_release_webhook_sub):
    payload = {
        'event_type': 'release',
        'branch': None,
        'commit': None,
        'author': {
            'name': 'owner',
            'id': 1
        },
        'link': 'https://github.com/owner/test/releases/tag/v1.0.0',
        'release': {
            'tag': 'v1.0.0',
            'name': 'test release 1'
        }
    }

    webhook_id = github_release_webhook_sub.webhook_id
    snapshot = GitSnapshot(payload=payload, webhook_id=webhook_id)

    github_release_webhook_sub.snapshots.append(snapshot)
    db.session.commit()

    serialized_data = GitWebhookSubscriberSchema().dump(
        github_release_webhook_sub).data
    assert serialized_data == {
        'id': github_release_webhook_sub.id,
        'host': 'github.com',
        'name': 'repository',
        'event_type': 'release',
        'owner': 'owner',
        'branch': None,
        'snapshots': [{
            'created': snapshot.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
            'payload': payload
        }]
    }

    serialized_data = GitWebhookSubscriberSchema(many=True).dump(
        [github_release_webhook_sub]).data
    assert serialized_data == [{
        'id': github_release_webhook_sub.id,
        'host': 'github.com',
        'name': 'repository',
        'event_type': 'release',
        'owner': 'owner',
        'branch': None,
        'snapshots': [{
            'created': snapshot.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
            'payload': payload
        }]
    }]
