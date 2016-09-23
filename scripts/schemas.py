# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
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

import errno
import os

PROJECT_BASE = os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir)
JSONSCHEMAS_DIR = os.path.join(
    PROJECT_BASE,
    'cap',
    'jsonschemas',
)

JSONSCHEMAS_OUT_DIR = os.path.join(
    PROJECT_BASE,
    'cap',
    'jsonschemas_gen',
)

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
