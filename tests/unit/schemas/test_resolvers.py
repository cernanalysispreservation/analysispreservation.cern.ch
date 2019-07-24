# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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


from invenio_jsonschemas.errors import JSONSchemaNotFound
from pytest import raises

from cap.modules.schemas.models import Schema
from cap.modules.schemas.resolvers import schema_name_to_url


def test_schema_name_to_url(db):
    db.session.add(Schema(name='my-schema', version='1.5.5'))
    db.session.add(Schema(name='my-schema', version='2.4.0'))
    db.session.add(Schema(name='my-schema', version='2.4.3'))
    db.session.add(Schema(name='different-schema', version='3.5.4'))
    db.session.commit()

    assert schema_name_to_url(
        'my-schema') == 'https://analysispreservation.cern.ch/schemas/deposits/records/my-schema-v2.4.3.json'


def test_schema_name_to_url_when_schema_doesnt_exist_raises_JSONSchemaNotFound(db):
    with raises(JSONSchemaNotFound):
        schema_name_to_url('non-existing-schema')
