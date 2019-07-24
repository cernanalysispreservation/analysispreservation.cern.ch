# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file
# for more details.

"""Records module configuration for CERN Analysis Preservation."""

from __future__ import absolute_import, print_function

import copy

from cap.modules.records.permissions import ReadRecordPermission
from cap.modules.search.facets import nested_filter
from invenio_deposit.config import DEPOSIT_REST_SORT_OPTIONS
from invenio_deposit.scopes import write_scope
from invenio_deposit.utils import check_oauth2_scope
from invenio_records_rest.config import RECORDS_REST_ENDPOINTS
from invenio_records_rest.facets import terms_filter


def _(x):
    """Identity function used to trigger string extraction."""
    return x


# Records
# =======
#: Records sort/facets options
RECORDS_REST_SORT_OPTIONS = dict(
    records=dict(
        bestmatch=dict(
            title=_('Best match'),
            fields=['_score'],
            order=1,
        ),
        mostrecent=dict(
            title=_('Most recent'),
            fields=['_updated'],
            default_order='desc',
            order=2,
        ),
    )
)
RECORDS_REST_SORT_OPTIONS.update(DEPOSIT_REST_SORT_OPTIONS)

#: Record search facets.
# for aggregations, only ones starting with facet_ will be displayed on a page
RECORDS_REST_FACETS = {
    'deposits': {
        'aggs': {
            'facet_status': {
                'terms': {
                    'field': 'status.keyword'
                }
            },
            'facet_type': {
                'terms': {
                    'field': '_type'
                }
            },
            'facet_cadi_status': {
                'terms': {
                    'field': 'cadi_status'
                }
            },
            'facet_publication_status': {
                'terms': {
                    'field': 'publication_status.keyword'
                }
            },
            "particles": {
                "nested": {
                    "path": "main_measurements.signal_event_selection"
                            ".physics_objects"
                },
                "aggs": {
                    "facet_physics_objects": {
                        "terms": {
                            "field": "main_measurements.signal_event_selection"
                                     ".physics_objects.object",
                            "exclude": ""
                        },
                        "aggs": {
                            "doc_count": {
                                "reverse_nested": {}
                            },
                            "facet_physics_objects_type": {
                                "terms": {
                                    "field": "main_measurements"
                                             ".signal_event_selection"
                                             ".physics_objects"
                                             ".object_type.keyword"
                                },
                                "aggs": {
                                    "doc_count": {
                                        "reverse_nested": {}
                                    }
                                }
                            }
                        }
                    },
                }
            },
        },
        'post_filters': {
            'type': terms_filter('_type'),
            'status': terms_filter('status.keyword'),
            'cadi_status': terms_filter('cadi_status'),
            'publication_status': terms_filter('publication_status.keyword'),
            'conference': terms_filter('conference'),
            'physics_objects': nested_filter(
                'main_measurements.signal_event_selection.physics_objects',
                'main_measurements.signal_event_selection'
                '.physics_objects.object'
            ),
            'physics_objects_type': nested_filter(
                'main_measurements.signal_event_selection.physics_objects',
                'main_measurements.signal_event_selection.physics_objects'
                '.object_type.keyword'),
        }
    },
    'records': {
        'aggs': {
            'facet_type': {
                'terms': {
                    'field': '_type'
                }
            },
            'facet_cadi_status': {
                'terms': {
                    'field': 'cadi_status'
                }
            },
            'facet_publication_status': {
                'terms': {
                    'field': 'publication_status.keyword'
                }
            },
            "particles": {
                "nested": {
                    "path": "main_measurements.signal_event_selection"
                            ".physics_objects"
                },
                "aggs": {
                    "facet_physics_objects": {
                        "terms": {
                            "field": "main_measurements.signal_event_selection"
                                     ".physics_objects.object",
                            "exclude": ""
                        },
                        "aggs": {
                            "doc_count": {
                                "reverse_nested": {}
                            },
                            "facet_physics_objects_type": {
                                "terms": {
                                    "field": "main_measurements"
                                             ".signal_event_selection"
                                             ".physics_objects"
                                             ".object_type.keyword"
                                },
                                "aggs": {
                                    "doc_count": {
                                        "reverse_nested": {}
                                    }
                                }
                            }
                        }
                    },
                }
            },
        },
        'post_filters': {
            'type': terms_filter('_type'),
            'cadi_status': terms_filter('cadi_status'),
            'publication_status': terms_filter('publication_status.keyword'),
            'conference': terms_filter('conference'),
            'physics_objects': nested_filter(
                'main_measurements.signal_event_selection.physics_objects',
                'main_measurements.signal_event_selection'
                '.physics_objects.object'
            ),
            'physics_objects_type': nested_filter(
                'main_measurements.signal_event_selection.physics_objects',
                'main_measurements.signal_event_selection.physics_objects'
                '.object_type.keyword'),
        }
    }
}

#: Records REST API endpoints.
RECORDS_REST_ENDPOINTS = copy.deepcopy(RECORDS_REST_ENDPOINTS)
RECORDS_REST_ENDPOINTS['recid'].update({
    'record_class': 'cap.modules.records.api:CAPRecord',
    'pid_fetcher': 'cap_record_fetcher',
    'search_class': 'cap.modules.records.search:CAPRecordSearch',
    'search_factory_imp': 'cap.modules.search.query'
    ':cap_search_factory',
    'record_serializers': {
        'application/json': ('cap.modules.records.serializers'
                             ':json_v1_response'),
        'application/basic+json': ('cap.modules.records.serializers'
                                   ':basic_json_v1_response')
    },
    'search_serializers': {
        'application/json': ('cap.modules.records.serializers'
                             ':json_v1_search'),
        'application/basic+json': ('cap.modules.records.serializers'
                                   ':basic_json_v1_search'),
    },
    'read_permission_factory_imp': check_oauth2_scope(
        lambda record: ReadRecordPermission(record).can(),
        write_scope.id),
})
