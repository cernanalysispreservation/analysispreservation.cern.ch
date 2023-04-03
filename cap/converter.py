"""URL Map Converter module."""

import re

from flask import abort
from werkzeug.routing import BaseConverter

SCHEMA_VERSION_REGEXP = r'^\d+\.\d+\.\d+$'


class SchemaVersionConverter(BaseConverter):
    """Converter class for validating schema version number."""

    def __init__(self, url_map):
        """Initialise converter."""
        super().__init__(url_map)

    def to_python(self, value):
        if not bool(re.match(SCHEMA_VERSION_REGEXP, value)):
            abort(404)
        return value

    def to_url(self, value):
        return value
