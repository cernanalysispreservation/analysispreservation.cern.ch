#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
"""Update workflows."""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = 'c69fd55b5b50'
down_revision = 'a85d38b8e3e9'
branch_labels = ()
depends_on = None

status_enum = sa.Enum('created',
                      'queued',
                      'running',
                      'stopped',
                      'failed',
                      'finished',
                      'deleted',
                      name='reana_workflow_status')


def upgrade():
    """Upgrade database."""
    # ### commands auto generated by Alembic - please adjust! ###
    status_enum.create(op.get_bind())
    op.add_column('reana_workflows',
                  sa.Column('user_id', sa.Integer(), nullable=False))
    op.drop_column('reana_workflows', 'cap_user_id')

    op.add_column(
        'reana_workflows',
        sa.Column('workflow_name_run', sa.String(length=100), nullable=False))
    op.drop_column('reana_workflows', 'name_run')

    op.add_column(
        'reana_workflows',
        sa.Column('created',
                  sa.DateTime(),
                  server_default=sa.text(u'now()'),
                  nullable=True)),
    op.add_column(
        'reana_workflows',
        sa.Column('updated',
                  sa.DateTime(),
                  server_default=sa.text(u'now()'),
                  nullable=True)),

    op.alter_column('reana_workflows',
                    sa.Column('status', status_enum, nullable=False))

    op.create_foreign_key(('fk_reana_workflows_user_id_accounts_user'),
                          'reana_workflows', 'accounts_user', ['user_id'],
                          ['id'])
    # ### end Alembic commands ###


def downgrade():
    """Downgrade database."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('reana_workflows', 'created')
    op.drop_column('reana_workflows', 'updated')
    op.drop_column('reana_workflows', 'user_id')
    op.drop_column('reana_workflows', 'workflow_name_run')

    op.alter_column('reana_workflows',
                    sa.Column('status', sa.String(100), nullable=False))

    op.add_column(
        'reana_workflows',
        sa.Column('cap_user_id',
                  sa.INTEGER(),
                  autoincrement=False,
                  nullable=False))
    op.add_column('reana_workflows',
                  sa.Column('name_run', sa.String(length=100), nullable=False))

    status_enum.drop(op.get_bind())
    # ### end Alembic commands ###
