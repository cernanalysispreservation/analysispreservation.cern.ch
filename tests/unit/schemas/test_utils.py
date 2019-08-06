from flask_security import login_user
from pytest import mark

from cap.modules.schemas.models import Schema
from cap.modules.schemas.permissions import (AdminSchemaPermission,
                                             ReadSchemaPermission)
from cap.modules.schemas.utils import (add_schema_from_fixture,
                                       get_schemas_for_user)


def test_add_schema_from_fixture_when_schema_does_not_exist_create_new_one(
        app, users):  # noqa
    data = dict(
        name='new-schema',
        version='1.2.3',
        experiment='CMS',
        fullname='New fullname',
        deposit_schema={'title': 'deposit_schema'},
        deposit_options={'title': 'deposit_options'},
        record_schema={'title': 'record_schema'},
        record_options={'title': 'record_options'},
        record_mapping={'doc': {
            'properties': {
                "title": {
                    "type": "text"
                }
            }
        }},
        deposit_mapping={
            'doc': {
                'properties': {
                    "keyword": {
                        "type": "keyword"
                    }
                }
            }
        },
        is_indexed=True,
        use_deposit_as_record=True)

    add_schema_from_fixture(data=data)

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
    updated_data = dict(
        name='new-schema',
        version='1.1.1',
        experiment='LHCb',
        fullname='New fullname',
        deposit_schema={'title': 'deposit_schema'},
        deposit_options={'title': 'deposit_options'},
        record_schema={'title': 'record_schema'},
        record_options={'title': 'record_options'},
        record_mapping={'doc': {
            'properties': {
                "title": {
                    "type": "text"
                }
            }
        }},
        deposit_mapping={
            'doc': {
                'properties': {
                    "keyword": {
                        "type": "keyword"
                    }
                }
            }
        },
        is_indexed=True,
        use_deposit_as_record=True)
    db.session.add(
        Schema(**{
            'name': 'new-schema',
            'experiment': 'CMS',
            'fullname': 'Old Schema',
        }))
    db.session.commit()

    add_schema_from_fixture(data=updated_data)

    schema = Schema.get('new-schema', version='1.1.1')
    for key, value in updated_data.items():
        assert getattr(schema, key) == value
