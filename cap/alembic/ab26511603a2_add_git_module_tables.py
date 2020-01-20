#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
"""Add git module tables."""

import sqlalchemy as sa
from alembic import op
from sqlalchemy_utils.types import uuid

from cap.types import json_type

# revision identifiers, used by Alembic.
revision = 'ab26511603a2'
down_revision = '82e2d44ea710'
branch_labels = ()
depends_on = None
type_enum = sa.Enum('notify', 'download', name='git_webhook_subscribertype')
webhook_status_enum = sa.Enum('active', 'deleted', name='git_webhook_status')


def upgrade():
    """Upgrade database."""
    op.create_table(
        'git_repository', sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('external_id', sa.Integer(), nullable=False),
        sa.Column('host', sa.String(length=255), nullable=False),
        sa.Column('owner', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('branch', sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint('id', name='pk_git_repository'),
        sa.UniqueConstraint('host',
                            'owner',
                            'name',
                            'branch',
                            name='uq_git_repository_unique_constraint'))
    op.create_table(
        'git_webhook', sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('event_type', sa.String(length=255), nullable=False),
        sa.Column('external_id', sa.String(length=255), nullable=False),
        sa.Column('secret', sa.String(length=32), nullable=True),
        sa.Column('repo_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['repo_id'], [u'git_repository.id'],
                                name='fk_git_webhook_repo_id_git_repository'),
        sa.PrimaryKeyConstraint('id', name='pk_git_webhook'),
        sa.UniqueConstraint('event_type',
                            'repo_id',
                            name='uq_git_webhook_unique_constraint'))
    op.create_table(
        'git_snapshot', sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('payload', json_type, nullable=True),
        sa.Column('tag', sa.String(length=255), nullable=True),
        sa.Column('ref', sa.String(length=255), nullable=True),
        sa.Column('webhook_id', sa.Integer(), nullable=True),
        sa.Column('created',
                  sa.DateTime(),
                  nullable=True,
                  server_default=sa.func.current_timestamp()),
        sa.ForeignKeyConstraint(['webhook_id'], [u'git_webhook.id'],
                                name='fk_git_snapshot_webhook_id_git_webhook'),
        sa.PrimaryKeyConstraint('id', name='pk_git_snapshot'))
    op.create_table(
        'git_subscriber', sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('type', type_enum, nullable=False),
        sa.Column('status', webhook_status_enum, nullable=False),
        sa.Column('record_id', uuid.UUIDType(), nullable=False),
        sa.Column('webhook_id', sa.Integer(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ['user_id'], [u'accounts_user.id'],
            name='fk_git_subscriber_user_id_accounts_user'),
        sa.ForeignKeyConstraint(
            ['record_id'], [u'records_metadata.id'],
            name='fk_git_subscriber_record_id_records_metadata'),
        sa.ForeignKeyConstraint(
            ['webhook_id'], [u'git_webhook.id'],
            name='fk_git_subscriber_webhook_id_git_webhook'),
        sa.PrimaryKeyConstraint('id', name='pk_git_subscriber'),
        sa.UniqueConstraint(
            'record_id',
            'webhook_id',
            name='uq_git_webhook_subscriber_unique_constraint'))


def downgrade():
    """Downgrade database."""
    op.drop_table('git_subscriber')
    op.drop_table('git_snapshot')
    op.drop_table('git_webhook')
    op.drop_table('git_repository')
    type_enum.drop(op.get_bind())
    webhook_status_enum.drop(op.get_bind())
