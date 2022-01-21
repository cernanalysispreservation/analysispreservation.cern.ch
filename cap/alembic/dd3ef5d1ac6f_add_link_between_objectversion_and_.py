#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
"""Add link between ObjectVersion and GitSnapshot."""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = 'dd3ef5d1ac6f'
down_revision = 'b08b97981a0d'
branch_labels = ()
depends_on = None


def upgrade():
    """Upgrade database."""
    op.add_column('files_object',
                  sa.Column('snapshot_id', sa.Integer(), nullable=True))
    op.create_foreign_key(op.f('fk_files_object_snapshot_id_git_snapshot'),
                          'files_object', 'git_snapshot', ['snapshot_id'],
                          ['id'])


def downgrade():
    """Downgrade database."""
    op.drop_constraint(op.f('fk_files_object_snapshot_id_git_snapshot'),
                       'files_object',
                       type_='foreignkey')
    op.drop_column('files_object', 'snapshot_id')
