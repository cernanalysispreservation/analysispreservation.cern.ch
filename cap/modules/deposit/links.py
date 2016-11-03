"""Deposit links factory."""

from __future__ import absolute_import, print_function


from invenio_deposit.links import deposit_links_factory
from invenio_records_files.links import default_bucket_link_factory


def links_factory(pid):
    """Deposit links factory."""
    links = deposit_links_factory(pid)

    # Update 'html' key to point to the frontend app
    # links['html'] = links['html'].replace('/app/', '/')

    bucket_link = default_bucket_link_factory(pid)
    if bucket_link is not None:
        links['bucket'] = bucket_link
    return links
