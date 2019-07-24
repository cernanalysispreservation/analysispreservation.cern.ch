from pytest import mark

from cap.modules.schemas.models import Schema
from cap.modules.schemas.utils import add_or_update_schema


@mark.skip('method add_or_update_schema has to be updated')
def test_add_or_update_schema_when_schema_does_not_exist_create_new_one(db):  # noqa
    data = {
        'experiment': 'CMS',
        'fullname': 'Test Schema',
        'deposit_schema': {'field': 'string'}
    }

    add_or_update_schema(fullpath='records/ana1-v1.0.2.json',
                         data=data)

    schema = Schema.get_by_fullpath('records/ana1-v1.0.2.json')
    assert schema.name == 'records/ana1'
    assert schema.fullname == data['fullname']
    assert schema.experiment == data['experiment']
    assert schema.deposit_schema == data['jsonschema']
    assert schema.major == 1
    assert schema.minor == 0
    assert schema.patch == 2


@mark.skip('method add_or_update_schema has to be updated')
def test_add_or_update_schema_when_schema_already_exist_updates_json_for_schema(db):  # noqa
    db.session.add(Schema(**{
        'name': 'records/ana1',
        'major': 1,
        'minor': 0,
        'patch': 2,
        'experiment': 'CMS',
        'fullname': 'Old Schema',
        'deposit_schema': {'field': 'initial'}
    }))
    db.session.commit()
    updated_data = {
        'experiment': 'Updated',
        'fullname': 'Updated Schema',
        'deposit_schema': {
            'updated': 'string'
        }
    }

    add_or_update_schema(fullpath='records/ana1-v1.0.2.json',
                         data=updated_data)

    schema = Schema.get_by_fullpath('records/ana1-v1.0.2.json')
    assert schema.name == 'records/ana1'
    assert schema.fullname == updated_data['fullname']
    assert schema.experiment == updated_data['experiment']
    assert schema.deposit_schema == updated_data['deposit_schema']
    assert schema.major == 1
    assert schema.minor == 0
    assert schema.patch == 2
