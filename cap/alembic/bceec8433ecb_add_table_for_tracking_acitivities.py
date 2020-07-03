#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
"""Add table for tracking acitivities."""

import sqlalchemy as sa
from alembic import op

from cap.types import json_type

# revision identifiers, used by Alembic.
revision = 'bceec8433ecb'
down_revision = 'dd3ef5d1ac6f'
branch_labels = ()
depends_on = None


def upgrade():
    """Upgrade database."""
    op.create_table(
        'activity', sa.Column('id', sa.BigInteger(), nullable=False),
        sa.Column('verb', sa.Unicode(length=255), nullable=True),
        sa.Column('transaction_id', sa.BigInteger(), nullable=False),
        sa.Column('data', json_type),
        sa.Column('object_type', sa.String(length=255), nullable=True),
        sa.Column('object_id', sa.BigInteger(), nullable=True),
        sa.Column('object_tx_id', sa.BigInteger(), nullable=True),
        sa.Column('target_type', sa.String(length=255), nullable=True),
        sa.Column('target_id', sa.BigInteger(), nullable=True),
        sa.Column('target_tx_id', sa.BigInteger(), nullable=True),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_activity')))
    op.create_index(op.f('ix_activity_transaction_id'),
                    'activity', ['transaction_id'],
                    unique=False)


def downgrade():
    """Downgrade database."""
    op.drop_index(op.f('ix_activity_transaction_id'), table_name='activity')
    op.drop_table('activity')
