# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

"""Deposit API."""

from __future__ import absolute_import, print_function

from invenio_deposit.api import Deposit, preserve
from invenio_files_rest.models import Bucket, Location
from invenio_records_files.models import RecordsBuckets

PRESERVE_FIELDS = (
    '_deposit',
    '_buckets',
    '_files',
)


class CAPDeposit(Deposit):
    """Define API for changing deposit state."""

    def is_published(self):
        """Check if deposit is published."""
        return self['_deposit'].get('pid') is not None

    @classmethod
    def create(cls, data, id_=None):
        """Create a deposit.

        Adds bucket creation immediately on deposit creation.
        """
        bucket = Bucket.create(
            default_location=Location.get_default()
        )
        data['_buckets'] = {'deposit': str(bucket.id)}
        deposit = super(CAPDeposit, cls).create(data, id_=id_)
        RecordsBuckets.create(record=deposit.model, bucket=bucket)
        return deposit

    @preserve(result=False, fields=PRESERVE_FIELDS)
    def clear(self, *args, **kwargs):
        """Clear only drafts."""
        super(CAPDeposit, self).clear(*args, **kwargs)
