# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2022 CERN.
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

"""Deposit validators."""

import os
from jsonschema import Draft4Validator
from jsonschema.validators import extend

from cap.modules.experiments.validators import (validate_cms_trigger,
                                                validate_das_path,
                                                validate_unique_cadi)
# from .users import validate_editing_field

deposit_validators = dict(Draft4Validator.VALIDATORS)

if not os.environ.get("CAP_CMS_VALIDATION_DISABLE"):
    deposit_validators['x-validate-cms-trigger'] = validate_cms_trigger
    deposit_validators['x-validate-das-path'] = validate_das_path
deposit_validators['x-validate-unique-cadi'] = validate_unique_cadi
# deposit_validators['x-validate-cadi-id'] = validate_cadi_id

# check for editing permission
# deposit_validators['x-cap-permission'] = validate_editing_field

DepositValidator = extend(Draft4Validator, validators=deposit_validators)
NoRequiredValidator = extend(DepositValidator, {'required': None})
