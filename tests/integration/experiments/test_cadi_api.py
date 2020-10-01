
import json
from time import sleep

def test_deposit_validation_with_same_cadi_id(
        client, users, auth_headers_for_user, json_headers, create_schema,
        create_deposit, das_datasets_index, cms_triggers_index):
    owner = users['cms_user']
    schema = create_schema('cms-analysis',
                experiment='CMS',
                deposit_schema={
                    'type': 'object',
                    'properties': {
                          "basic_info": {
                              "properties": {
                              "cadi_id": {
                                  "pattern": "^[A-Z0-9]{3}-[0-9]{2}-[0-9]{3}$",
                                  "type": "string",
                                  "x-validate-unique-cadi": {},
                                  "placeholder": "e.g. JME-10-107",
                                  "title": "CADI ID",
                                  "description": "e.g. JME-10-107"
                              }}
                          },
                        'title': {
                            'type': 'string',
                            'minLength': 5
                        },
                        'obj': {
                            'type': 'object',
                            'properties': {
                                'allowed_prop': {
                                    'type': 'string'
                                }
                            },
                            'additionalProperties': False
                        },
                    },
                })

    headers = auth_headers_for_user(owner)
    schema.process_action_users('allow', 
                         [('deposit-schema-create', owner.email)])

    # create a deposit with a specific CADI ID
    first = client.post("/deposits",
        data=json.dumps({
        "$ana_type":"cms-analysis",
        "basic_info":{
          "cadi_id":"ABC-12-123"
        }
      }), headers=headers + json_headers)

    pid = first.json.get("id")

    update = client.put("/deposits/"+pid,
      data=json.dumps({
      "$ana_type":"cms-analysis",
      "basic_info":{
        "cadi_id":"ABC-12-123",
        "abstract":"This is the update"
      }
    }), headers=headers + json_headers)


    sleep(1)
    second = client.post("/deposits",
      data=json.dumps({
      "$ana_type":"cms-analysis",
      "basic_info":{
        "cadi_id":"ABC-12-123"
      }
    }), headers=headers + json_headers)

    assert first.status_code == 201
    assert update.status_code == 200
    assert second.status_code == 400
    assert second.json.get("message") == "Validation error: This ID is already attached to another record."





