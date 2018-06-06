# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
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
# or submit itself to any jurisdiction.

import pytest

from uuid import uuid4

from conftest import minimal_deposits_metadata
from invenio_deposit.minters import deposit_minter
from cap.modules.deposit.api import CAPDeposit as Deposit
from jsonschema.exceptions import ValidationError


@pytest.mark.parametrize("user, schema", [
    ('alice_user', 'alice-analysis-v0.0.1'),
    ('atlas_user', 'atlas-analysis-v0.0.1'),
    ('atlas_user', 'atlas-workflows-v0.0.1'),
    ('cms_user', 'cms-analysis-v0.0.1'),
    ('cms_user', 'cms-questionnaire-v0.0.1'),
    ('cms_user', 'cms-auxiliary-measurements-v0.0.1'),
    ('lhcb_user', 'lhcb-v0.0.1'),
])
def test_jsonschemas_with_no_additional_properties_is_success(user, schema, users, create_deposit):
    deposit = create_deposit(users[user], schema)
    assert 'id' in deposit['_deposit']


def test_jsonschemas_with_additional_properties_fails(app, db, location):
    with app.test_request_context():
        metadata = minimal_deposits_metadata('test-schema-v0.0.1')
        id_ = uuid4()
        deposit_minter(id_, metadata)
        with pytest.raises(ValidationError):
            Deposit.create(metadata, id_=id_)
