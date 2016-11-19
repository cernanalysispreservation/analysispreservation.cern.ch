"""Configuration for record search."""

from elasticsearch_dsl import Q, TermsFacet
from flask import has_request_context
from flask_login import current_user
from invenio_search import RecordsSearch
from invenio_search.api import DefaultFilter

# from .permissions import admin_permission_factory


def records_filter():
    """Filter list of deposits.
    Permit to the user to see all if:
    * The user is an admin (see
        func:`invenio_deposit.permissions:admin_permission_factory`).
    * It's called outside of a request.
    Otherwise, it filters out any deposit where user is not the owner.
    """

    if not has_request_context(): # or admin_permission_factory().can():
        return Q()
    else:
        return Q(
            'match', **{'_deposit.owners': getattr(current_user, 'id', 0)}
        )


class CapRecordSearch(RecordsSearch):
    """Default search class."""

    class Meta:
        """Configuration for record search."""
        index = 'records'
        doc_types = None
        fields = ('*', )
        facets = {}

        default_filter = None
        # default_filter = DefaultFilter(records_filter)
