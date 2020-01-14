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

"""Serializers for CDS records."""

from __future__ import absolute_import, print_function

from flask import abort
from marshmallow import Schema, fields

ACCEPTED_TYPES = {
    'proceedings',
    'book',
    'report',
    'article',
    'thesis',
    'preprint',
    'standard'
}


def flatten_subkeys(data, key):
    """Flattens the values of a specific key in a list of dicts."""
    # useful e.g. with article types, etc
    obj = data[key]

    if isinstance(obj, dict):
        if key not in list(data.keys()):
            return None
        else:
            return [obj[subkey] for subkey in obj.keys()]

    elif isinstance(data[key], tuple):
        return [item[subkey] for item in obj
                for subkey in item.keys()]
    return None


class CDSRecordSchema(Schema):
    cds_id = fields.Str(attribute='001', dump_only=True)
    links = fields.Method('get_links', dump_only=True)
    record_types = fields.Method('get_types', dump_only=True)

    title = fields.Method('get_title', dump_only=True)
    abstract = fields.Str(attribute='520__.a', dump_only=True)

    authors = fields.Method('get_authors', dump_only=True)
    subjects = fields.Method('get_subjects', dump_only=True)
    files = fields.Method('get_urls', dump_only=True)

    def get_links(self, obj):
        """Retrieve the different platform links."""
        links_dict = {}

        def get_link_id(_items, name):
            if isinstance(_items, tuple):
                _id = next(
                    (item['a'] for item in _items if item["9"] == name),
                    None)
            else:
                _id = _items['a']
            return _id

        # ARXIV key - not always the same key!
        try:
            item_id = get_link_id(obj['037__'], 'arXiv')
            if item_id and 'arxiv' in item_id:
                links_dict.update(arxiv='https://arxiv.org/abs/{}'
                                  .format(item_id))
        except KeyError:
            pass

        # INSPIRE key
        try:
            item_id = get_link_id(obj['035__'], 'Inspire')
            if item_id:
                links_dict.update(inspire='http://inspirehep.net/record/{}'
                                  .format(item_id))
        except KeyError:
            pass

        # check for the DOI key
        if '0247_' in obj.keys():
            links_dict.update(doi=obj['0247_']['a'])

        return links_dict

    def get_types(self, obj):
        types = flatten_subkeys(obj, '980__')
        if any(_type.lower() in ACCEPTED_TYPES for _type in types):
            return types
        else:
            abort(400, 'The article type is not supported by CAP. Choose one '
                       'of: Article, Report, Book, Proceedings, Preprint, '
                       'Standard, Thesis')

    def get_title(self, obj):
        types = flatten_subkeys(obj, '980__')
        return obj['111__']['a'] if 'PROCEEDINGS' in types \
            else obj['245__']['a']

    def get_urls(self, obj):
        try:
            if isinstance(obj['8564_'], dict):
                return [{
                    'url': obj['8564_']['u'],
                    'desc': obj['8564_'].get('y')
                }]
            else:
                return [{'url': item['u'], 'desc': item.get('y')}
                        for item in obj['8564_']]
        except KeyError:
            return []

    def get_authors(self, obj):
        """Retrieve the authors of the CDS record."""

        def append_authors(item):
            if isinstance(item, dict):
                authors.append(item['a'])
            else:
                for _author in item:
                    authors.append(_author['a'])

        authors = []
        author_types = [
            '100__',  # main author
            '700__',  # other authors
            '710__',  # corporate authors
            '110__'   # more corporate authors
        ]

        for _type in author_types:
            try:
                author = obj[_type]
                append_authors(author)
            except KeyError:
                pass
        return authors

    def get_subjects(self, obj):
        try:
            subjects = obj['65017']
            return [sub['a'] for sub in subjects]
        except TypeError:
            return [obj['65017']['a']]
        except KeyError:
            return []
