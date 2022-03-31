# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2022 CERN.
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

"""CAP ADL ingestion service views."""

from typing import List, Optional
from dataclasses import dataclass, field
import re
from flask import current_app, abort


TABLE_HEADER = '# val    err-     err+     xmin     xmax'
MULTI_KEYWORDS = ['select', 'histo', 'bin', 'take']


@dataclass(frozen=True)
class Line:
    text: str # noqa


@dataclass
class Block:
    block_type: Optional[str] = None # noqa
    lines: List[Line] = field(default_factory=list) # noqa


@dataclass
class Keyword:
    block_type: Optional[str] = None # noqa
    line: Line = None # noqa


def _collect_lines(file_handler):
    """Return a line generator for the block/keyword."""
    _COMMENT = '#'
    for line in file_handler:
        line = line.decode('utf-8')
        text = line.strip()
        if not text:
            continue
        elif text.startswith(TABLE_HEADER):
            yield Line(text)
        elif not text.startswith(_COMMENT):
            # Skip comment lines
            yield Line(text)


def _collect_blocks(lines):
    """Return a block/keyword generator."""
    _block_object = Block()
    for line in lines:
        _keyword_object_yield = False
        _block_type = line.text.split()[0]
        if _regex_block_heading_match(line.text):
            if _block_object:
                yield _block_object
            _block_object = Block(block_type=_block_type)
        elif _regex_keyword_match(_block_type, define=True):
            _keyword_object = Keyword(block_type=_block_type, line=line)
            _keyword_object_yield = True
            yield _keyword_object
        if _block_object and not _keyword_object_yield:
            _block_object.lines.append(line)
    if _block_object:
        yield _block_object


def _regex_block_match(_block_type):
    _block_type_regexp = {
        'object': re.compile(r'object'),
        'region': re.compile(r'region'),
        'info': re.compile(r'info'),
        'table': re.compile(r'table'),
    }
    for _block in _block_type_regexp:
        pattern = _block_type_regexp[_block]
        if pattern.fullmatch(_block_type):
            return True
    return False


def _regex_block_heading_match(_block_heading):
    _block_heading_regexp = {
        'object': re.compile('(?:object|obj) (?P<blockname>[\w-]+)'),
        'region': re.compile('(?:region|algo) (?P<blockname>[\w-]+)'),
        'info': re.compile('(?:info) (?P<blockname>[\w-]+)'),
        'table': re.compile('(?:table) (?P<blockname>[\w-]+)'),
    }
    for block_heading in _block_heading_regexp:
        pattern = _block_heading_regexp[block_heading]
        if pattern.match(_block_heading):
            return True
    return False


def _regex_keyword_match(_keyword_type, define=False):
    _keyword_type_regexp = {
        'define': re.compile(r'define'),
        'select': re.compile(r'select'),
        'reject': re.compile(r'reject'),
        'take': re.compile(r'take'),
        'using': re.compile(r'using'),
        'sort': re.compile(r'sort'),
        'weight': re.compile(r'weight'),
        'histo': re.compile(r'histo'),
    }
    if define:
        pattern = _keyword_type_regexp['define']
        return pattern.fullmatch(_keyword_type)
    for _keyword in _keyword_type_regexp:
        pattern = _keyword_type_regexp[_keyword]
        if pattern.fullmatch(_keyword_type):
            return True
    return False


def _get_key_value(line):
    # Split the keywords and values
    line_data = line.text.split(' ', 1)
    return line_data


def _handle_multi_keyword(key, select_value, _block_data):
    if _block_data.get(key):
        _block_data[key].append(select_value)
    else:
        _block_data[key] = [select_value]
    return _block_data


def _adl_logger(_type, message):
    if _type == 'info':
        return current_app.logger.info(message)
    if _type == 'error':
        return current_app.logger.error(message)


def _object_block_parser(block):
    block_data = {}
    if len(block.lines) == 1 and block.block_type == 'object':
        return _union_keyword_parser(block.lines[0].text)
    for line in block.lines:
        line_key_value = _get_key_value(line)
        if not line_key_value:
            _adl_logger(
                _type='info',
                message='Skipping invalid keyword value pair {}'.format(line))
            continue
        if line_key_value[0] in MULTI_KEYWORDS:
            block_data = _handle_multi_keyword(
                line_key_value[0], line_key_value[-1], block_data)
        else:
            block_data.update({
                line_key_value[0]: line_key_value[-1]
            })
    return block_data


def _region_block_parser(block):
    block_data = {}
    for line in block.lines:
        line_key_value = _get_key_value(line)
        if not line_key_value:
            _adl_logger(
                _type='info',
                message='Skipping invalid keyword value pair {}'.format(line))
            continue
        if len(line_key_value) == 1:
            block_data['parent'] = line_key_value[-1]
            continue
        if line_key_value[0] in MULTI_KEYWORDS:
            block_data = _handle_multi_keyword(
                line_key_value[0], line_key_value[-1], block_data)
        else:
            block_data.update({
                line_key_value[0]: line_key_value[-1]
            })
    return block_data


def _info_block_parser(block):
    _adl_logger(
        _type='info',
        message='Info block parsing is not implemented yet.')


def _table_block_parser(block):
    block_data = {
        'data': []
    }
    for line in block.lines:
        if line.text == TABLE_HEADER:
            # Todo: Make check more general since header can be different.
            continue
        values = line.text.split()
        if len(values) == 5:
            block_data['data'].append({
                'val': values[0],
                'err-': values[1],
                'err+': values[2],
                'xmin': values[3],
                'xmax': values[4],
            })
        else:
            line_key_value = _get_key_value(line)
            if not line_key_value:
                _adl_logger(
                    _type='info',
                    message='Skipping invalid keyword value pair {}'.format(
                        line))
                continue
            block_data.update({
                line_key_value[0]: line_key_value[-1]
            })
    return block_data


def _define_block_parser(block):
    block_data = {}
    line_data = block.line.text.split("=")
    _define_key = line_data[0].strip().split(" ")[-1]
    _define_value = line_data[1].strip()
    block_data.update({
        _define_key: _define_value
    })
    return block_data


def _union_keyword_parser(line_text):
    block_data = {}
    if ':' not in line_text:
        return block_data
    line_data = line_text.split(":", 1)
    line_key_value = line_data[0].strip().split(' ', 1)
    if _regex_block_match(line_key_value[0]):
        block_data.update({
            line_key_value[0]: line_key_value[-1]
        })
    block_data.update({
        'parent': line_data[-1].strip()
    })
    return block_data


def adl_parser(adl_file=None, deposit=False):
    """Returns the ADL parsed file as JSON object.

    :param type: File
    :param adl_file: Input .adl from the user.
    :return : JSON object
    """
    block_data = []
    json_parsed = {
        'objects': [],
        'regions': [],
        'infos': [],
        'tables': [],
        'define': [],
    }

    if deposit:
        with adl_file.storage().open() as file_handler:
            for b in _collect_blocks(_collect_lines(file_handler)):
                block_data.append(b)
    else:
        with adl_file as file_handler:
            for b in _collect_blocks(_collect_lines(file_handler)):
                block_data.append(b)

    for block in block_data:
        if block.block_type == 'object':
            json_parsed['objects'].append(_object_block_parser(block))
        if block.block_type == 'region':
            json_parsed['regions'].append(_region_block_parser(block))
        if block.block_type == 'info':
            json_parsed['infos'].append(_info_block_parser(block))
        if block.block_type == 'table':
            json_parsed['tables'].append(_table_block_parser(block))
        if block.block_type == 'define':
            json_parsed['define'].append(_define_block_parser(block))

    return json_parsed


def check_file_format(filename):
    if not filename.endswith('.adl'):
        abort(400, 'You tried to provide a wrong adl file.')


def check_uploaded_files(file_objects):
    if len(file_objects) == 0:
        abort(400, 'Please select file for parsing.')

    if len(file_objects) > 1:
        abort(400, 'Multiple files upload is not supported yet.')
