"""Configuration for record search."""

from elasticsearch_dsl import Q
from flask_login import current_user
from invenio_search import RecordsSearch
from invenio_search.api import DefaultFilter

from cap.modules.access.permissions import admin_permission_factory
from cap.modules.access.utils import login_required
from cap.modules.user.views import get_user_experiments


@login_required
def records_filter():
    """Filter list of deposits."""
    if admin_permission_factory(None).can():
        return Q()

    user_experiments = get_user_experiments()

    q = Q('multi_match', query=current_user.id, fields=[
        '_deposit.owners'
    ])

    for experiment in user_experiments:
        q = q | Q('match', **{'_experiment': experiment})

    return Q(q)


class CAPRecordSearch(RecordsSearch):
    """Default search class."""

    class Meta:
        """Configuration for records search."""

        index = 'records'
        doc_types = None
        fields = ('*',)
        facets = {}
        default_filter = DefaultFilter(records_filter)

    def get_user_records(self):
        """Get records that current user owns."""
        return self.filter(
            Q('multi_match', query=current_user.id, fields=['_deposit.owners'])
        )

    def sort_by_latest(self):
        """Sort by latest (updated)."""
        return self.sort(
            {'_updated': {'unmapped_type': 'date', 'order': 'desc'}}
        )
