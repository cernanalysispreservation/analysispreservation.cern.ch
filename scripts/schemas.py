import os
import errno

PROJECT_BASE = os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir)
JSONSCHEMAS_DIR = os.path.join(
    PROJECT_BASE,
    'cap',
    'modules',
    'records',
    'jsonschemas')

JSONSCHEMAS_OUT_DIR = os.path.join(
    PROJECT_BASE,
    'cap',
    'modules',
    'records',
    'jsonschemas_gen')

print(PROJECT_BASE)
print(JSONSCHEMAS_DIR)
print("-----------------------")

BASE_URL = "https://analysis-preservation.cern.ch"
UPDATETO_URL = "https://localhost:5000"


def update_refs_jsonfile(jsonschema_path, textToSearch, textToReplace):
    input = open(jsonschema_path)

    filename = jsonschema_path.replace(JSONSCHEMAS_DIR, JSONSCHEMAS_OUT_DIR)
    if not os.path.exists(os.path.dirname(filename)):
        try:
            os.makedirs(os.path.dirname(filename))
        except OSError as exc:
            # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

    output = open(filename, 'w')

    for s in input.xreadlines():
        output.write(s.replace(textToSearch, textToReplace))

    output.close()
    input.close()

for root, dirs, files in os.walk(JSONSCHEMAS_DIR):
    for file in files:
        if file.endswith(".json"):
            print(os.path.join(root, file))
            update_refs_jsonfile(
                os.path.join(root, file),
                BASE_URL,
                UPDATETO_URL)
