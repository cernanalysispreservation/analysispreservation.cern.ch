# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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
# or submit itself to any jurisdiction.

"""Unit tests Cap Deposit utils."""

from __future__ import absolute_import, print_function

from cap.modules.deposit.utils import clean_empty_values


def test_cleaning_of_empty_values():
    """Test cleaning of values."""
    model = {
        "_deposit": {
            "created_by": 7,
            "id": "914f01bd513a4428be3289aeb587e742",
            "owners": [
                7
            ],
            "status": "draft"
        },
        "_experiment": "CMS",
        "_files": [

        ],
        "dream_team": '',
        "the_best_dream_team": "thor_team",
        "testing": {
            "test_inner": "hello"
        },
        "additional_resources": {
            "documentations": [
                {

                }
            ],
            "internal_discussions": [
                {

                }
            ],
            "presentations": [
                {

                }
            ],
            "publications": [
                {
                    "persistent_identifiers": [

                    ]
                }
            ]
        },
        "basic_info": {
            "people_info": [
                {

                }
            ]
        },
        "cms_questionnaire": {},
        "general_title": "Created 12/04/2017, 15:08:08",
    }
    result = clean_empty_values(model)
    assert "additional_resources" not in result
    assert "cms_questionnaire" not in result
    assert "the_best_dream_team" in result
    assert "testing" in result
