#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
"""Change external_id in GitWebhook from str to int."""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = '637a2a528700'
down_revision = 'dd3ef5d1ac6f'
branch_labels = ()
depends_on = None


def upgrade():
    """Upgrade database."""
    op.execute('ALTER TABLE git_webhook ALTER COLUMN '
               'external_id TYPE integer USING external_id::integer')


def downgrade():
    """Downgrade database."""
    op.execute('ALTER TABLE git_webhook ALTER COLUMN '
               'external_id TYPE varchar USING external_id::varchar')
