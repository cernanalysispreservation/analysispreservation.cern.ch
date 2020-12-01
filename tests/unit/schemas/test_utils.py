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

from cap.modules.schemas.cli import add_schema_from_json
from cap.modules.schemas.models import Schema
from cap.modules.schemas.permissions import (AdminSchemaPermission,
                                             ReadSchemaPermission)
from cap.modules.schemas.utils import get_indexed_schemas_for_user
from flask_security import login_user


def test_add_schema_from_fixture_when_schema_does_not_exist_create_new_one(
        app, users):  # noqa
    data = dict(name='new-schema',
                version='1.2.3',
                experiment='CMS',
                fullname='New fullname',
                deposit_schema={'title': 'deposit_schema'},
                deposit_options={'title': 'deposit_options'},
                record_schema={'title': 'record_schema'},
                record_options={'title': 'record_options'},
                record_mapping={
                    'mappings': {
                        'doc': {
                            'properties': {
                                "title": {
                                    "type": "text"
                                }
                            }
                        }
                    }
                },
                deposit_mapping={
                    'mappings': {
                        'doc': {
                            'properties': {
                                "keyword": {
                                    "type": "keyword"
                                }
                            }
                        }
                    }
                },
                is_indexed=True,
                use_deposit_as_record=False)

    add_schema_from_json(data=data)

    schema = Schema.get('new-schema', version='1.2.3')
    for key, value in data.items():
        assert getattr(schema, key) == value

    with app.test_request_context():
        login_user(users['cms_user'])
        assert ReadSchemaPermission(schema).can()
        assert not AdminSchemaPermission(schema).can()

        login_user(users['lhcb_user'])
        assert not ReadSchemaPermission(schema).can()
        assert not AdminSchemaPermission(schema).can()


def test_add_schema_from_fixture_when_schema_already_exist_updates_json_for_schema(
        db):
    updated_data = dict(name='new-schema',
                        version='1.1.1',
                        experiment='LHCb',
                        fullname='New fullname',
                        deposit_schema={'title': 'deposit_schema'},
                        deposit_options={'title': 'deposit_options'},
                        record_schema={'title': 'record_schema'},
                        record_options={'title': 'record_options'},
                        record_mapping={
                            'mappings': {
                                'doc': {
                                    'properties': {
                                        "title": {
                                            "type": "text"
                                        }
                                    }
                                }
                            }
                        },
                        deposit_mapping={
                            'mappings': {
                                'doc': {
                                    'properties': {
                                        "keyword": {
                                            "type": "keyword"
                                        }
                                    }
                                }
                            }
                        },
                        is_indexed=True,
                        use_deposit_as_record=False)
    db.session.add(
        Schema(**{
            'name': 'new-schema',
            'experiment': 'CMS',
            'fullname': 'Old Schema',
        }))
    db.session.commit()

    add_schema_from_json(data=updated_data)

    schema = Schema.get('new-schema', version='1.1.1')
    for key, value in updated_data.items():
        assert getattr(schema, key) == value


def test_get_indexed_schemas_for_user_when_latest(app, db, users):
    db.session.add(
        Schema(name='schema1',
               version='1.3.1',
               is_indexed=True,
               experiment='CMS'))
    db.session.add(
        Schema(name='schema1',
               version='2.5.7',
               is_indexed=True,
               experiment='CMS'))
    db.session.add(
        Schema(name='schema1',
               version='3.0.0',
               is_indexed=False,
               experiment='CMS'))
    db.session.add(
        Schema(name='schema3',
               version='1.3.1',
               is_indexed=True,
               experiment='LHCb'))
    latest_schema1 = Schema(name='schema1',
                            version='3.4.5',
                            is_indexed=True,
                            experiment='CMS')
    latest_schema2 = Schema(name='schema2',
                            version='3.0.0',
                            is_indexed=True,
                            experiment='CMS')
    db.session.add(latest_schema1)
    db.session.add(latest_schema2)
    db.session.commit()

    login_user(users['cms_user'])

    schemas = get_indexed_schemas_for_user(latest=True)

    assert schemas == [latest_schema1, latest_schema2]
