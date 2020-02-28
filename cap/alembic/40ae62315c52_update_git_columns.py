#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
"""Move branch column to GitWebhook table; Clean Snapshot table"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '40ae62315c52'
down_revision = 'c69fd55b5b50'
branch_labels = ()
depends_on = None


def upgrade():
    """Upgrade database."""
    op.drop_constraint('uq_git_repository_unique_constraint',
                       'git_repository',
                       type_='unique')
    op.create_unique_constraint('uq_git_repository_unique_constraint',
                                'git_repository', ['host', 'owner', 'name'])
    op.drop_column('git_repository', 'branch')
    op.alter_column('git_snapshot',
                    'webhook_id',
                    existing_type=sa.INTEGER(),
                    nullable=False)
    op.drop_column('git_snapshot', 'ref')
    op.drop_column('git_snapshot', 'tag')
    op.alter_column('git_subscriber',
                    'webhook_id',
                    existing_type=sa.INTEGER(),
                    nullable=False)
    op.drop_column('git_subscriber', 'type')
    op.add_column('git_webhook',
                  sa.Column('branch', sa.String(length=255), nullable=True))


def downgrade():
    """Downgrade database."""
    op.drop_column('git_webhook', 'branch')
    op.add_column(
        'git_subscriber',
        sa.Column('type',
                  postgresql.ENUM('notify',
                                  'download',
                                  name='git_webhook_subscribertype'),
                  autoincrement=False,
                  nullable=False,
                  server_default='download'))
    op.alter_column('git_subscriber',
                    'webhook_id',
                    existing_type=sa.INTEGER(),
                    nullable=True)
    op.add_column(
        'git_snapshot',
        sa.Column('tag',
                  sa.VARCHAR(length=255),
                  autoincrement=False,
                  nullable=True))
    op.add_column(
        'git_snapshot',
        sa.Column('ref',
                  sa.VARCHAR(length=255),
                  autoincrement=False,
                  nullable=True))
    op.alter_column('git_snapshot',
                    'webhook_id',
                    existing_type=sa.INTEGER(),
                    nullable=True)
    op.add_column(
        'git_repository',
        sa.Column('branch',
                  sa.VARCHAR(length=255),
                  autoincrement=False,
                  nullable=False,
                  server_default='master'))
    op.drop_constraint('uq_git_repository_unique_constraint',
                       'git_repository',
                       type_='unique')
    op.create_unique_constraint('uq_git_repository_unique_constraint',
                                'git_repository',
                                ['host', 'owner', 'name', 'branch'])
