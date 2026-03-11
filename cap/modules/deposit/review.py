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
"""Serializer for deposit reviews."""

from __future__ import absolute_import, print_function

import uuid
from datetime import datetime

from flask_login import current_user
from marshmallow import Schema, fields, validate

from cap.modules.deposit.errors import ReviewError, ReviewValidationError
from cap.modules.user.utils import get_user_email_by_id


class CommentSchema(Schema):
    """Schema for review comments."""

    id = fields.Str(required=True)
    body = fields.Str(required=True)
    reviewer = fields.Method('get_reviewer', dump_only=True)
    parent_id = fields.Str(allow_none=True)
    created_at = fields.Str(dump_only=True)

    def get_reviewer(self, obj):
        return get_user_email_by_id(obj['reviewer'])


class ReviewSchema(Schema):
    """Schema for deposit review."""

    type = fields.Str(
        validate=validate.OneOf(["approved", "request_changes", "declined"]),
        required=True,
    )
    body = fields.Str()
    id = fields.Str(required=True)
    reviewer = fields.Method('get_reviewer', dump_only=True)
    resolved = fields.Bool(default=False)
    resolved_by = fields.Method('get_resolved_by', dump_only=True)
    resolved_at = fields.Str(dump_only=True)
    created_at = fields.Str(dump_only=True)
    updated_at = fields.Str(dump_only=True)
    comments = fields.Nested(CommentSchema, many=True, dump_only=True)

    def get_reviewer(self, obj):
        return get_user_email_by_id(obj['reviewer'])

    def get_resolved_by(self, obj):
        resolved_by = obj.get('resolved_by')
        if resolved_by:
            return get_user_email_by_id(resolved_by)
        return None


class ReviewCreatePayload(Schema):
    """Schema for deposit review."""

    type = fields.Str(
        validate=validate.OneOf(["approved", "request_changes", "declined"]),
        required=True,
    )
    body = fields.Str()


class ReviewUpdatePayload(Schema):
    """Schema for deposit review."""

    id = fields.Str(required=True)
    action = fields.Str(
        validate=validate.OneOf(["comment", "delete", "resolve"]), required=True
    )
    body = fields.Str()
    parent_id = fields.Str()


class Reviewable(object):
    """Methods for review schema."""

    def schema_is_reviewable(self):
        config = self.schema.config

        if config:
            return config.get('reviewable', False)
        return False

    def create_review(self, data):
        new_review, errors = ReviewCreatePayload().load(data=data)

        if errors:
            raise ReviewValidationError(None, errors=errors)
        else:
            now = datetime.utcnow().isoformat()
            new_uuid = uuid.uuid4()
            new_review["id"] = str(new_uuid)
            new_review["reviewer"] = current_user.id
            new_review["created_at"] = now
            new_review["updated_at"] = now
            new_review["resolved"] = False
            new_review["resolved_by"] = None
            new_review["resolved_at"] = None
            new_review["comments"] = []

            _review = self.get("_review", [])
            _review.append(new_review)
            self["_review"] = _review

    def update_review(self, data):
        payload, errors = ReviewUpdatePayload().load(data=data)

        reviews = self.get("_review", [])

        if errors:
            raise ReviewValidationError(None, errors=errors)
        else:
            review = None
            for i, r in enumerate(reviews):
                if r.get("id", None) == payload["id"]:
                    review = r
                    review_index = i
                    break

            if not review:
                raise ReviewError("Review 'id' passed is not correct")

            now = datetime.utcnow().isoformat()

            if payload["action"] == "resolve":
                reviews[review_index]["resolved"] = True
                reviews[review_index]["resolved_by"] = current_user.id
                reviews[review_index]["resolved_at"] = now
                reviews[review_index]["updated_at"] = now
            elif payload["action"] == "delete":
                del reviews[review_index]
            elif payload["action"] == "comment":
                body = payload.get("body")
                if not body:
                    raise ReviewError("Comment body is required")

                parent_id = payload.get("parent_id")
                if parent_id:
                    # Validate parent comment exists
                    parent_exists = any(
                        c.get("id") == parent_id
                        for c in reviews[review_index].get("comments", [])
                    )
                    if not parent_exists:
                        raise ReviewError(
                            "Parent comment 'id' passed is not correct"
                        )

                comment = {
                    "id": str(uuid.uuid4()),
                    "body": body,
                    "reviewer": current_user.id,
                    "parent_id": parent_id,
                    "created_at": now,
                }

                comments = reviews[review_index].get("comments", [])
                comments.append(comment)
                reviews[review_index]["comments"] = comments
                reviews[review_index]["updated_at"] = now

            self["_review"] = reviews
