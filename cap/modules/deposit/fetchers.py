"""PID Fetchers."""

from collections import namedtuple

from .providers import DepositUUIDProvider

from invenio_records_rest.views import Blueprint
from invenio_pidstore.providers.recordid import RecordIdProvider

FetchedPID = namedtuple('FetchedPID', ['provider', 'pid_type', 'pid_value'])

def cap_deposit_fetcher(record_uuid, data):
    """Fetch a deposit's identifiers."""

    return FetchedPID(
        provider=DepositUUIDProvider,
        pid_type=DepositUUIDProvider.pid_type,
        pid_value=int(data['_deposit']['id']),
    )
