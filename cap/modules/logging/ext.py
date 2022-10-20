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

"""CAP Logging."""

from __future__ import absolute_import, print_function

import logging

from prometheus_flask_exporter.multiprocess import (
    GunicornInternalPrometheusMetrics,
)

LOGGER = logging.getLogger(__name__)


class CAPLogging(object):
    """CAP logging extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        self.init_prometheus_flask_exporter(app)

    def init_prometheus_flask_exporter(self, app):
        enable_exporter_flask = app.config.get(
            "PROMETHEUS_ENABLE_EXPORTER_FLASK", False
        )

        if not enable_exporter_flask:
            LOGGER.debug(
                f"Prometheus Flask exporter is not enabled for {app.name}."
            )
            return

        prefix = app.name
        metrics_flask = GunicornInternalPrometheusMetrics.for_app_factory(
            defaults_prefix=prefix, group_by=url_rule
        )
        metrics_flask.init_app(app)
        LOGGER.debug(
            f"Prometheus Flask exporter is initialized with prefix {prefix}."
        )
