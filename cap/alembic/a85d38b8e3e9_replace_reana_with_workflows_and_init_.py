#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
"""Replace reana with workflows and init table."""

import sqlalchemy as sa
import sqlalchemy_utils
from alembic import op
from sqlalchemy.dialects import postgresql

from cap.types import json_type

# revision identifiers, used by Alembic.
revision = 'a85d38b8e3e9'
down_revision = 'ab26511603a2'
branch_labels = ()
depends_on = None

service_enum = sa.Enum('reana', name='service')


def upgrade():
    """Upgrade database."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        'reana_workflows',
        sa.Column('id', sqlalchemy_utils.types.uuid.UUIDType(),
                  nullable=False),
        sa.Column('rec_uuid',
                  sqlalchemy_utils.types.uuid.UUIDType(),
                  nullable=False),
        sa.Column('cap_user_id', sa.Integer(), nullable=False),
        sa.Column('workflow_id',
                  sqlalchemy_utils.types.uuid.UUIDType(),
                  nullable=False),
        sa.Column('service', service_enum, nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('workflow_name', sa.String(length=100), nullable=False),
        sa.Column('name_run', sa.String(length=100), nullable=False),
        sa.Column('status', sa.String(length=100), nullable=False),
        sa.Column('workflow_json',
                  json_type,
                  default=lambda: dict(),
                  nullable=True),
        sa.Column('logs', json_type, default=lambda: dict(), nullable=True),
        sa.ForeignKeyConstraint(
            ['rec_uuid'], [u'records_metadata.id'],
            name='fk_reana_workflows_rec_uuid_records_metadata'),
        sa.PrimaryKeyConstraint('id', name=('pk_reana_workflows')),
        sa.UniqueConstraint('workflow_id',
                            name='uq_reana_workflows_workflow_id'))
    op.drop_table('reana')


# ### end Alembic commands ###


def downgrade():
    """Downgrade database."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        'reana',
        sa.Column('id', postgresql.UUID(), autoincrement=False,
                  nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False,
                  nullable=False),
        sa.Column('record_id',
                  postgresql.UUID(),
                  autoincrement=False,
                  nullable=False),
        sa.Column('reana_id',
                  postgresql.UUID(),
                  autoincrement=False,
                  nullable=False),
        sa.Column('name',
                  sa.VARCHAR(length=100),
                  autoincrement=False,
                  nullable=False),
        sa.Column('params',
                  postgresql.JSON(astext_type=sa.Text()),
                  autoincrement=False,
                  nullable=True),
        sa.Column('output',
                  postgresql.JSON(astext_type=sa.Text()),
                  autoincrement=False,
                  nullable=True),
        sa.ForeignKeyConstraint(['record_id'], [u'records_metadata.id'],
                                name=u'fk_reana_record_id_records_metadata'),
        sa.PrimaryKeyConstraint('id', name=u'pk_reana'),
        sa.UniqueConstraint('reana_id', name=u'uq_reana_reana_id'))

    op.drop_table('reana_workflows')

    service_enum.drop(op.get_bind())
    # ### end Alembic commands ###
