"""Configuration for record search."""

from elasticsearch_dsl import Q
from flask import abort
from flask_login import current_user
# from cap.modules.access.views import get_user_experiments
from flask_principal import Permission
from invenio_search import RecordsSearch
from invenio_search.api import DefaultFilter

from cap.modules.access.permissions import admin_permission_factory


def records_filter(experiments_needs, admin_needs=None):
    """Filter list of deposits."""
    if current_user.is_authenticated:
        if admin_permission_factory(None).can():
            return Q()

        user_experiments = []

        for exp in experiments_needs:
            if Permission(*experiments_needs[exp]).can():
                user_experiments.append(exp.lower())

        q = {
            "bool": {
                "should": [
                    {
                        "terms": {
                            "_experiment": user_experiments
                        }
                    }
                ]
            }
        }

        return Q(q)
    else:
        abort(403)


def cap_record_search_factory(needs, admin_needs):
    """Search factory wrapper."""
    class CapRecordSearch(RecordsSearch):
        """Default search class."""

        # exp_permissions = []

        def __init__(self, **kwargs):

            # default_filter = DefaultFilter(records_filter(exp_permissions))

            self.Meta.index = 'records'
            self.Meta.doc_types = None
            self.Meta.fields = ('*', )
            # self.Meta.facets = {
            #     'status': TermsFacet(field='_deposit.status'),
            # }
            self.Meta.default_filter = DefaultFilter(
                records_filter(needs, admin_needs))

            super(CapRecordSearch, self).__init__(**kwargs)

    return CapRecordSearch
