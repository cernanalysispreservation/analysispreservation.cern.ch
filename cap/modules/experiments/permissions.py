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

"""Experiments permissions."""

from cap.config import EXPERIMENT_NEEDS
from invenio_access.permissions import Permission


class ExperimentPermission(Permission):
    """Generic experiment permission."""

    def __init__(self, experiment):
        """Constructor.

        Args:
        deposit: deposit to which access is requested.
        """
        exp_needs = EXPERIMENT_NEEDS.get(experiment)

        _needs = set()
        _needs.update(exp_needs)

        super(ExperimentPermission, self).__init__(*_needs)


cms_permission = ExperimentPermission('CMS')
alice_permission = ExperimentPermission('ALICE')
atlas_permission = ExperimentPermission('ATLAS')
lhcb_permission = ExperimentPermission('LHCb')
