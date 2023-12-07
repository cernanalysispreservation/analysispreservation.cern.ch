# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2016-2019 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Marshmallow based DublinCore serializer for records."""

import csv

from invenio_records_rest.serializers.base import (
    PreprocessorMixin,
    SerializerMixinInterface,
)
from invenio_records_rest.serializers.marshmallow import MarshmallowMixin


class Line(object):
    """Object that implements an interface the csv writer accepts."""

    def __init__(self):
        """Initialize."""
        self._line = None

    def write(self, line):
        """Write a line."""
        self._line = line

    def read(self):
        """Read a line."""
        return self._line


class CSVSerializer(
    SerializerMixinInterface, MarshmallowMixin, PreprocessorMixin
):
    """CSV serializer for records.

    Note: This serializer is not suitable for serializing large number of
    records.
    """

    def __init__(self, *args, **kwargs):
        """Initialize CSVSerializer.

        :param csv_excluded_fields: list of paths of the fields that
                                    should be excluded from the final output
        :param csv_included_fields: list of paths of the only fields that
                                    should be included in the final output
        :param header_separator: separator that should be used when flattening
                                 nested dictionary keys
        """
        self.csv_excluded_fields = kwargs.pop("csv_excluded_fields", [])
        self.csv_included_fields = kwargs.pop("csv_included_fields", [])

        if self.csv_excluded_fields and self.csv_included_fields:
            raise ValueError(
                "Please provide only fields to either include or exclude"
            )

        self.header_separator = kwargs.pop("header_separator", "_")
        super().__init__(*args, **kwargs)

    def serialize(self, pid, record, links_factory=None):
        """Serialize a single record and persistent identifier.

        :param pid: Persistent identifier instance.
        :param record: Record instance.
        :param links_factory: Factory function for record links.
        """
        record = self.process_dict(
            self.transform_record(pid, record, links_factory)
        )

        return self._format_csv([record])

    def serialize_search(
        self, pid_fetcher, search_result, links=None, item_links_factory=None
    ):
        """Serialize a search result.

        :param pid_fetcher: Persistent identifier fetcher.
        :param search_result: The search engine result.
        :param links: Dictionary of links to add to response.
        :param item_links_factory: Factory function for record links.
        """
        records = []
        for hit in search_result["hits"]["hits"]:
            processed_hit = self.transform_search_hit(
                pid_fetcher(hit["_id"], hit["_source"]),
                hit,
                links_factory=item_links_factory,
            )
            records.append(self.process_dict(processed_hit))

        return self._format_csv(records)

    def process_dict(self, dictionary):
        """Transform record dict with nested keys to a flat dict."""
        return self._flatten(dictionary)

    def _format_csv(self, records):
        """Return the list of records as a CSV string."""
        # build a unique list of all records keys as CSV headers
        headers = set()
        for rec in records:
            headers.update(rec.keys())

        # write the CSV output in memory
        line = Line()
        writer = csv.DictWriter(line, fieldnames=sorted(headers))
        writer.writeheader()
        yield line.read()

        for record in records:
            writer.writerow(record)
            yield line.read()

    def _flatten(self, value, parent_key=""):
        """Flattens nested dict recursively, skipping excluded fields."""
        items = []
        sep = self.header_separator if parent_key else ""

        if isinstance(value, dict):
            for k, v in value.items():
                # for dict, build a key field_subfield, e.g. title_subtitle
                new_key = parent_key + sep + k
                # skip excluded keys
                if new_key in self.csv_excluded_fields:
                    continue
                if self.csv_included_fields and not self.key_in_field(
                    new_key, self.csv_included_fields
                ):
                    continue
                items.extend(self._flatten(v, new_key).items())
        elif isinstance(value, list):
            for index, item in enumerate(value):
                # for lists, build a key with an index, e.g. title_0_subtitle
                new_key = parent_key + sep + str(index)
                # skip excluded keys
                if new_key in self.csv_excluded_fields:
                    continue
                if self.csv_included_fields and not self.key_in_field(
                    parent_key, self.csv_included_fields
                ):
                    continue
                items.extend(self._flatten(item, new_key).items())
        else:
            items.append((parent_key, value))

        return dict(items)

    def key_in_field(self, key, fields):
        """Checks if the given key is contained within any of the fields."""
        for field in fields:
            if key in field:
                return True
        return False
