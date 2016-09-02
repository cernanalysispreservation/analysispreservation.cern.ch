"""Deposit links factory."""

from __future__ import absolute_import, print_function

from flask import current_app, request

from invenio_deposit.links import deposit_links_factory


def links_factory(pid):
    """Deposit links factory."""
    links = deposit_links_factory(pid)

    links['html'] = current_app.config['DEPOSIT_UI_ENDPOINT'].format(
        host=request.host,
        scheme=request.scheme,
        pid_value=pid.pid_value,
    )

    return links