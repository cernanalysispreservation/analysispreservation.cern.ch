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
from pytest import mark


@mark.parametrize("schema_params,index_name", [
    ({'name': 'records/ana1', 'major': 1, 'minor': 0, 'patch': 1, 'mapping': {
        "records-ana1-1.0.1":{
            "properties": {
                "field1": {"type": "text"}
            }
        }}
      }, 'records-ana1-v1.0.1'),
    ({'name': 'deposits/records/ana1', 'major': 2, 'minor': 1, 'patch': 0, 'is_deposit': True}, 'deposits-records-ana1-v2.1.0'),
])
def test_on_save_mapping_is_created_and_index_name_added_to_mappings_map(schema_params, index_name, db, es):
    schema = Schema(**schema_params)
    db.session.add(schema)
    db.session.commit()

    assert index_name in current_search.mappings.keys()
    assert es.indices.exists(index_name)

    db.session.delete(schema)
    db.session.commit()

    assert not es.indices.exists(index_name)
