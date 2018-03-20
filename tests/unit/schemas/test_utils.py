import json

from pytest import raises

from cap.modules.schemas.models import Schema
from cap.modules.schemas.utils import add_or_update_schema


def test_add_or_update_schema_when_schema_does_not_exist_create_new_one(db):  # noqa
    json_content = json.dumps({'field': 'a'})

    add_or_update_schema(fullpath='records/ana1-v1.0.2.json',
                         json=json_content)

    schema = Schema.get_by_fullstring('records/ana1-v1.0.2.json')
    assert schema.name == 'records/ana1'
    assert schema.major == 1
    assert schema.minor == 0
    assert schema.patch == 2
    assert schema.json == json_content


def test_add_or_update_schema_when_schema_already_exist_updates_json_for_schema(db):  # noqa
    updated_json = json.dumps({'field': 'updated'})
    db.session.add(Schema(**{
        'name': 'records/ana1',
        'major': 1,
        'minor': 0,
        'patch': 2,
        'json': json.dumps({'field': 'initial'})
    }))
    db.session.commit()

    add_or_update_schema(fullpath='records/ana1-v1.0.2.json',
                         json=updated_json)

    schema = Schema.get_by_fullstring('records/ana1-v1.0.2.json')
    assert schema.name == 'records/ana1'
    assert schema.major == 1
    assert schema.minor == 0
    assert schema.patch == 2
    assert schema.json == updated_json
