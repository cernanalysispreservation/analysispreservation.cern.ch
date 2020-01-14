#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
"""Create cap tables."""

import sqlalchemy as sa
from alembic import op
from sqlalchemy_utils import UUIDType

from cap.types import json_type

# revision identifiers, used by Alembic.
revision = '54e5e2c6fea7'
down_revision = '3f72c7137c4e'
branch_labels = ()
depends_on = ['07fb52561c5c', 'e12419831262']


def upgrade():
    """Upgrade database."""
    op.create_table(
        'schema', sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=128), nullable=False),
        sa.Column('major', sa.Integer(), nullable=False),
        sa.Column('minor', sa.Integer(), nullable=False),
        sa.Column('patch', sa.Integer(), nullable=False),
        sa.Column('json', json_type, default=lambda: dict(), nullable=True),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_schema')),
        sa.UniqueConstraint('name',
                            'major',
                            'minor',
                            'patch',
                            name='unique_schema_version'))
    op.create_table(
        'reana', sa.Column('id', UUIDType(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('record_id', UUIDType(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('params', json_type, default=lambda: dict(), nullable=True),
        sa.Column('output', json_type, default=lambda: dict(), nullable=True),
        sa.ForeignKeyConstraint(
            ['record_id'], [u'records_metadata.id'],
            name=op.f('fk_reana_record_id_records_metadata')),
        sa.ForeignKeyConstraint(['user_id'], [u'accounts_user.id'],
                                name=op.f('fk_reana_user_id_accounts_user')),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_reana')))


def downgrade():
    op.drop_table('schema')
    op.drop_table('reana')
