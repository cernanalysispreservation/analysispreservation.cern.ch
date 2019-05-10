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

"""Cern Analysis Preservation methods for DAS database connection."""

import json

from elasticsearch import helpers
from invenio_search.proxies import current_search_client as es

DAS_DATASETS_MAPPING = {
    "mappings": {
        "doc": {
            "properties": {
                "name": {
                    "type": "completion",
                    "analyzer": "standard"
                }
            }
        }
    }
}


def cache_das_datasets_in_es_from_file(file):
    """
    Cache datasets names from DAS in ES, so can be used for autocompletion.

    As change has to be tranparent
    * put everything under index with a different name
    * redirect alias to point to newly created index
    * remove old index
    """
    if es.indices.exists('das-datasets-v1'):
        old_index, new_index = ('das-datasets-v1',
                                'das-datasets-v2')
    else:
        old_index, new_index = ('das-datasets-v2',
                                'das-datasets-v1')

    # create new index
    es.indices.create(index=new_index, body=DAS_DATASETS_MAPPING)

    # index datasets from file under new index
    try:
        with open(file, 'r') as fp:
            res = json.load(fp)
            source = [x['dataset'][0] for x in res]
            bulk_index_from_source(new_index, 'doc', source)
    except Exception:
        # delete index if sth went wrong
        es.indices.delete(index=old_index)
        raise

    # add newly created index under das-datasets alias
    es.indices.put_alias(index=new_index, name='das-datasets')

    # remove old index
    if es.indices.exists(old_index):
        es.indices.delete(index=old_index)

    print("Datasets are safe in ES.")


def bulk_index_from_source(index_name, doc_type, source):
    """Index in ES from given source.

    :params str index_name: index name
    :params str doc_type: document type
    :params dict source: content to be indexed
    """
    actions = [{
        "_index": index_name,
        "_type": doc_type,
        "_id": idx,
        "_source": obj
    } for idx, obj in enumerate(source)]

    helpers.bulk(es, actions)
