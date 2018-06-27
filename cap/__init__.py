# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file
# for more details.

"""CERN Analysis Preservation.

Running
-------
Starting a development server is as simple as:

.. code-block:: console

    $ export FLASK_DEBUG=1
    $ invenio run

.. note::

   You must enable the debug mode as done above to prevent that all
   connections are forced to HTTPS since the development server does not work
   with HTTPS.

Celery workers can be started using the command:

.. code-block:: console

    $ celery worker -A invenio_app.celery -l INFO

An interactive Python shell is started with the command:

.. code-block:: console

    $ invenio shell

Production
----------
To run your Invenio instance in a production mode, you probably want to tweak
some configuration to handle more traffic than in case of your development
setup (described in the previous section). For example, you can use the
uWSGI server instead of the default Flask server or setup celery to start more
workers.
To see how to start the uWSGI server and other services, check the
docker-compose.full.yml file.
"""

from __future__ import absolute_import, print_function

from .version import __version__

__all__ = ('__version__', )
