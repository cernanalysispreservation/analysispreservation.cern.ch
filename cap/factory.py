# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2017-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Flask application factories for Invenio flavours."""

from __future__ import absolute_import, print_function

import os
import sys

import pkg_resources
from invenio_base.app import create_app_factory
from invenio_base.wsgi import wsgi_proxyfix
from invenio_cache import BytecodeCache
from jinja2 import ChoiceLoader, FileSystemLoader


from invenio_app.factory import (
    app_class,
    invenio_config_loader,
    instance_path,
    static_folder)


def config_loader(app, **kwargs_config):
    """Configuration loader.

    Adds support for loading templates from the Flask application's instance
    folder (``<instance_folder>/templates``).
    """
    # This is the only place customize the Flask application right after
    # it has been created, but before all extensions etc are loaded.
    local_templates_path = os.path.join(app.instance_path, 'templates')
    if os.path.exists(local_templates_path):
        # Let's customize the template loader to look into packages
        # and application templates folders.
        app.jinja_loader = ChoiceLoader([
            FileSystemLoader(local_templates_path),
            app.jinja_loader,
        ])

    app.jinja_options = dict(
        app.jinja_options,
        cache_size=1000,
        bytecode_cache=BytecodeCache(app)
    )

    app.url_map.strict_slashes = False
    invenio_config_loader(app, **kwargs_config)


create_api = create_app_factory(
    'invenio',
    config_loader=config_loader,
    blueprint_entry_points=['invenio_base.api_blueprints'],
    extension_entry_points=['invenio_base.api_apps'],
    converter_entry_points=['invenio_base.api_converters'],
    wsgi_factory=wsgi_proxyfix(),
    instance_path=instance_path,
    app_class=app_class(),
)
"""Flask application factory for Invenio REST API."""
