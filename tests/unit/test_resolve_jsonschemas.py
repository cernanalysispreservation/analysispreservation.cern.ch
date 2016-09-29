import copy
import os
import unittest

from flask import Flask
from mock import patch

from cap.cli import compile_jsonschema_cli
from cap.compilers import _resolve_all_of, _resolve_ref
from cap.utils import resolve_schema_path

base_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "title": "Deposit schema."
}


def test_resolve_all_of_when_no_all_of_key_returns_unchanged_schema(app):
    schema = _resolve_all_of(base_schema)

    assert schema == base_schema


def test_resolve_all_of_removes_all_of_key(app):
    base_schema['allOf'] = [{},{}]

    schema = _resolve_all_of(base_schema)

    assert 'allOf' not in schema


def test_resolve_all_of_adds_all_properties_to_root_schema(app):
    base_schema['allOf'] = [
        {
            'a': 'a',
            'b': 'b',
        },
        {
            'c': 'c',
        }
    ]
    keys = [k for d in base_schema['allOf'] for k in d.keys()]

    schema = _resolve_all_of(base_schema)

    assert set(keys).issubset(schema)


@patch('cap.compilers._resolve_ref')
def test_resolve_all_of_adds_all_refschema_properties_to_root_schema(mock_method, app):
    ref_schemas = [
        {'a': 'b'}, 
        {'b': 'c'},
    ]
    ref = {'$ref': ''}
    mock_method.side_effect = ref_schemas
    base_schema['allOf'] = [ref, ref]
    keys = [k for d in ref_schemas for k in d.keys()]

    schema = _resolve_all_of(base_schema)

    assert set(keys).issubset(schema)


def test_resolve_ref_when_no_ref_key_returns_unchanged_schema(app):
    schema = _resolve_ref(base_schema)

    assert schema == base_schema


@patch('cap.compilers.resolve_schema_path')
def test_resolve_ref_removes_ref_key(mock_method, app):
    base_schema['$ref'] = ''
    mock_method.return_value = {}

    schema = _resolve_ref(base_schema)

    assert '$ref' not in schema


@patch('cap.compilers.resolve_schema_path')
def test_resolve_ref_adds_all_refschema_properties_to_root_schema(mock_method, app):
    base_schema['$ref'] = ''
    ref_schema = {
        'a': 'a',
        'b': 'c',
    }
    mock_method.return_value = ref_schema

    schema = _resolve_ref(base_schema)

    assert set(ref_schema.keys()).issubset(schema)


def test_compile_jsonschema_cli_resolves_example_schemas(app):
    test_schemas_dir = 'test_schemas/'

    compile_jsonschema_cli(test_schemas_dir)
    expected_schema = resolve_schema_path('test_schemas/test-expected.json')

    output_schema = resolve_schema_path('test_schemas/test.json')
    assert output_schema == expected_schema
