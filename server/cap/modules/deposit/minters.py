"""PID minters."""

from __future__ import absolute_import, print_function

from .providers import DepositUUIDProvider


def cap_deposit_minter(record_uuid, data):
    """Mint deposit's PID."""
    provider = DepositUUIDProvider.create(
        object_type='rec', object_uuid=record_uuid
    )
    data['_deposit'] = {
        'id': int(provider.pid.pid_value),
        # FIXME: do not set the status once it is done by invenio-deposit API
        'status': 'draft',
    }

    return provider.pid
