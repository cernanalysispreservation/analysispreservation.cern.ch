import os, json
import re
import sys
from pprint import pprint

results = []
errors = []
PROJECT_BASE = os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir)
JSONSCHEMAS_DIR = os.path.join(
    PROJECT_BASE,
    'cap',
    'modules',
    'records',
    'jsonschemas',
    'records')
json_files = [pos_json for pos_json in os.listdir(JSONSCHEMAS_DIR) if pos_json.endswith('.json')]

def get_ref(d):
    """Returns all the $ref values in a list"""
    options = ['oneOf', 'anyOf', 'allOf']
    for k, v in d.iteritems():
        if isinstance(v, dict):
            get_ref(v)
        elif isinstance(v, list):
            if any(x in k for x in options):
                for r in v:
                    if '$ref' in r:                        
                        results.append(r['$ref'])
        else:
            if '$ref' in k:
                results.append(v)
    return results

def validate_ref(json_to_check):
    """Returns non valid $ref urls"""
    for url in get_ref(json_to_check):
        pattern = re.compile('^(http|https)://')
        out = pattern.match(url)
        if not out:
            errors.append("Location:" + os.path.join(JSONSCHEMAS_DIR, js) + " Error: Not valid url:" + url)

    return errors

for js in json_files:
    json_to_check = {}
    with open(os.path.join(JSONSCHEMAS_DIR, js)) as data_file:
        for key, value in json.load(data_file).items():
            if 'properties' in key:
                json_to_check.update(value)

        validate_ref(json_to_check)

    results = []

if errors:
    for i,j in enumerate(errors, start=1):
        pprint('{0}. {1}'.format(i, j))
    sys.exit(1)