#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
"""Add link between GitWebhookSubscriber and GitSnapshot"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = 'b08b97981a0d'
down_revision = '40ae62315c52'
branch_labels = ()
depends_on = None


def upgrade():
    """Upgrade database."""
    op.create_table(
        'git_subscriber_snapshots',
        sa.Column('snapshot_id', sa.Integer(), nullable=False),
        sa.Column('subscriber_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ['snapshot_id'], ['git_snapshot.id'],
            name=op.f('fk_git_subscriber_snapshots_snapshot_id_git_snapshot')),
        sa.ForeignKeyConstraint(
            ['subscriber_id'], ['git_subscriber.id'],
            name=op.f(
                'fk_git_subscriber_snapshots_subscriber_id_git_subscriber')),
        sa.PrimaryKeyConstraint('snapshot_id',
                                'subscriber_id',
                                name=op.f('pk_git_subscriber_snapshots')))


def downgrade():
    """Downgrade database."""
    op.drop_table('git_subscriber_snapshots')
