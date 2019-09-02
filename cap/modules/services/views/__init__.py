# -*- coding: utf-8 -*-

"""CAP Services blueprint."""

from __future__ import absolute_import, print_function

import requests

from flask import Blueprint, current_app, jsonify


blueprint = Blueprint('cap_services',
                      __name__,
                      url_prefix='/services'
                      )

from . import zenodo, cern, orcid, indico, status_checks  # noqa
