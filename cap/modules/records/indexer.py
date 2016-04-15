"""Record modification prior to indexing."""

from __future__ import absolute_import, print_function


def indexer_receiver(sender, json=None, record=None, index=None,
                     **dummy_kwargs):
    """Connect to before_record_index signal to transform record for ES."""
    # Inject timestamp into record.
    json['_created'] = record.created
    json['_updated'] = record.updated
