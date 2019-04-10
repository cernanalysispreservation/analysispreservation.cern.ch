..  This file is part of Invenio
    Copyright (C) 2014, 2017 CERN.

    Invenio is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License as
    published by the Free Software Foundation; either version 2 of the
    License, or (at your option) any later version.

    Invenio is distributed in the hope that it will be useful, but
    WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Invenio; if not, write to the Free Software Foundation, Inc.,
    59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.

====================
 Installation Guide
====================

There are two possibilities for setting up your own development version
of CERN Analysis Preservation, a `Bare Installation`_ with python
virtualenvwrapper and a `Docker Installation`_.

Bare Installation
=================

This is a step-by-step guide for installing CERN Analysis Preservation
on your machine.

Prerequisites
-------------

CERN Analysis Preservation is based on Invenio v3.0 alpha, which
requires some additional software packages:

- `Elasticsearch <https://www.elastic.co/products/elasticsearch>`_
- `PostgreSQL <http://www.postgresql.org/>`_
- `RabbitMQ <http://www.rabbitmq.com/>`_
- `Redis <http://redis.io/>`_

For example, on Debian GNU/Linux, you can install them as follows:

.. code-block:: shell

   sudo apt-get install elasticsearch postgresql rabbitmq-server redis-server

Now, add the following lines in your "elasticsearch.yml" (for
Debian GNU/Linux the full path is
``/etc/elasticsearch/elasticsearch.yml``):

.. code-block:: shell

  # CAP CONFIGURATION
  cluster.name: cap
  discovery.zen.ping.multicast.enabled: false
  http.port: 9200
  http.publish_port: 9200

In order to use PostgreSQL you need to start the database server. This
is very operation system specific, so you should check how it works for
yours. When the server is running, switch to the default PostgreSQL user
and create a user who is allowed to create databases:

.. code-block:: shell

   createuser -d $Username

Finally, do a system-wide install (see below for how to do a local
install enclosed inside your virtual environment instead) for the Sass
preprocessor by following
`Sass web guide <http://sass-lang.com/install>`_ and running:

.. code-block:: shell

  sudo npm install -g node-sass@3.8.0 clean-css@3.4.12 uglify-js requirejs

Installation
------------

Let's start by cloning the repository:

.. code-block:: shell

   git clone https://github.com/cernanalysispreservation/analysispreservation.cern.ch.git cap

To use git hooks shared by our team:

.. code-block:: shell

    # Git version 2.9 or greater
    git config core.hooksPath .githooks

    # older versions
    find .git/hooks -type l -exec rm {} \;
    find .githooks -type f -exec ln -sf ../../{} .git/hooks/ \;

All else will be installed inside a python *virtualenv* for easy
maintenance and encapsulation of the libraries required. From inside
your `cap` folder you can choose anytime whatever virtual environment
you want to work on (just type `workon virtualenv_installed`) or you can
choose to create a new one.

To do the latter, create a new virtual environment to hold our CAP
instance from inside the repository folder:

.. code-block:: shell

   cd cap
   mkvirtualenv cap

Install the CAP package from inside your ``cap`` repository folder and
run npm to install the necessary JavaScript assets the Invenio modules
depend on:

.. code-block:: shell

   pip install -r requirements.txt
   cap npm
   cdvirtualenv var/cap-instance/static
   npm install bower
   npm install

Build the assets from your repository folder:

.. code-block:: shell

   cd -
   cap collect -v
   cap assets build
   python ./scripts/schemas.py

Start Elasticsearch in the background:

.. code-block:: shell

   elasticsearch &

**Note:**	Instead of the following steps you may want to run
``./scripts/init.sh``.

Create a database to hold persistent data:

.. code-block:: shell

   cap db init
   cap db create

Create test user accounts and roles with which you can log in later:

.. code-block:: shell

   cap users create info@inveniosoftware.org -a --password infoinfo
   cap users create alice@inveniosoftware.org -a --password alicealice
   cap users create atlas@inveniosoftware.org -a --password atlasatlas
   cap users create cms@inveniosoftware.org -a --password cmscms
   cap users create lhcb@inveniosoftware.org -a --password lhcblhcb

   cap roles create analysis-preservation-support@cern.ch
   cap roles create alice-member@cern.ch
   cap roles create atlas-active-members-all@cern.ch
   cap roles create cms-members@cern.ch
   cap roles create lhcb-general@cern.ch

   cap roles add info@inveniosoftware.org analysis-preservation-support@cern.ch
   cap roles add alice@inveniosoftware.org alice-member@cern.ch
   cap roles add atlas@inveniosoftware.org atlas-active-members-all@cern.ch
   cap roles add cms@inveniosoftware.org cms-members@cern.ch
   cap roles add lhcb@inveniosoftware.org lhcb-general@cern.ch

``info`` is a superuser, ``alice`` is an ALICE user, ``atlas`` is an
ATLAS user, ``cms`` is a CMS user and ``lhcb`` is a LHCB user.

Create some basic collections for ElasticSearch:

.. code-block:: shell

   cap collections create CERNAnalysisPreservation
   cap collections create CMS -p CERNAnalysisPreservation
   cap collections create CMSQuestionnaire -p CMS -q '_type:cmsquestionnaire'
   cap collections create CMSAnalysis -p CMS -q '_type:cmsanalysis'
   cap collections create LHCb -p CERNAnalysisPreservation
   cap collections create LHCbAnalysis -p LHCb -q '_type:lhcbanalysis'
   cap collections create ATLAS -p CERNAnalysisPreservation
   cap collections create ATLASWorkflows -p ATLAS -q '_type:atlasworkflows'
   cap collections create ATLASAnalysis -p ATLAS -q '_type:atlasanalysis'
   cap collections create ALICE -p CERNAnalysisPreservation

Create the index in ElasticSearch using the mappings:

.. code-block:: shell

   cap index init

Create a location for files:

.. code-block:: shell

   cap files location local var/data --default

Now you are ready to run the server.

Populating the Database with Example Records
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you want to populate the database with example records simply run:

.. code-block:: shell

   # For creating demo records with schema validation
   cap fixtures records

   # For creating demo records without validation ( --force )
   cap fixtures records -f

Database Migrations
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We use `Alembic <http://alembic.zzzcomputing.com>`_  as a migration tool. Alembic stores all the changes, as a revisions under a specific branches. Changes for CERN Analysis Preservation are under *cap* branch.

To make sure, that your database is up to date with all the changes, run:

.. code-block:: shell

   cap alembic upgrade heads               

If you made some changes in one of the CAP models, Alembic can generate migration file for you. Keep in mind, that you need to specify parent revision for each of the revision (should be the latest revision for cap branch). 

.. code-block:: shell

   # To check parent revision
   cap alembic heads | grep cap

   # To create a new revision in cap branch
   cap alembic revision "Add some field" -b cap -p <parent-revision>

Prerequisites for Running the Server
------------------------------------

To run an https server you will have to create a certificate. This needs
to be done only once from inside your repository folder:

.. code-block:: shell

   openssl genrsa 4096 > ssl.key
   openssl req -key ssl.key -new -x509 -days 365 -sha256 -batch > ssl.crt

The certificate will be valid for 365 days.

Running the Server
------------------

Start a redis server in the background:

.. code-block:: shell

   redis-server &

Start the web application locally in debug mode:

.. code-block:: shell

   gunicorn -b 127.0.0.1:5000 --certfile=ssl.crt --keyfile=ssl.key cap.wsgi:application --workers 9 --log-level debug

Now you can log in locally in your browser by going to
``https://localhost:5000/login`` and entering one of the user
credentials created above, e.g. user ``info@inveniosoftware.org`` with
password ``infoinfo``.

General Recommendations
-----------------------

Specify Python Version
~~~~~~~~~~~~~~~~~~~~~~

You can specify the python version for the virtual environment on
creation as follows (e.g. to use python 2.7):

.. code-block:: shell

   mkvirtualenv -p /usr/bin/python2.7 cap

Local Installation of npms and gems
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You do not need to install sass and all npm dependencies globally on
your system. You can install them inside your virtual environment so
they will only be accessible from within it. Simply add:

.. code-block:: shell

   export GEM_HOME="$VIRTUAL_ENV/gems"
   export GEM_PATH=""
   export PATH="$GEM_HOME/bin:$PATH"
   export npm_config_prefix=$VIRTUAL_ENV

to the ``postactivate`` of your ``.virtualenv`` folder and run

.. code-block:: shell

   cdvirtualenv
   gem install sass
   npm -g install node-sass@3.8.0 clean-css@3.4.12 uglify-js requirejs

after creating your virtual environment.

Troubleshooting
---------------

Missing Requirements
~~~~~~~~~~~~~~~~~~~~

If you have trouble with the setup, check if you are missing one of the
following requirements, e.g. on Debian GNU/Linux:

.. code-block:: shell

   sudo apt-get install npm ruby gcc python-virtualenvwrapper

The version of Python 2 given by ``python --version`` or
``python2 --version`` should be greater than 2.7.10.

Non-matching Requirements
~~~~~~~~~~~~~~~~~~~~~~~~~

If you encounter a problem with requirements that do not match it may
be because the python eggs are not included in your virtualenv and you
will have to update them running:

.. code-block:: shell

   pip install -r requirements.txt

Database Indexing Problems
~~~~~~~~~~~~~~~~~~~~~~~~~~

If you have trouble indexing the database try:

.. code-block:: shell

   cap db destroy
   cap db init

and if that does not work try:

.. code-block:: shell

   curl -XDELETE 'http://localhost:9200/_all'
   cap db init



Docker Installation
===================

First, install ``docker-engine`` and ``docker-compose`` on your machine. 
The nginx build will need these files copied:

.. code-block:: shell

   cp ssl.crt docker/nginx/
   cp ssl.key docker/nginx/

Second, build the CERN Analysis Preservation images, using the development
configuration:

.. code-block:: shell

   docker-compose -f docker-compose-dev.yml build

Third, start the CERN Analysis Preservation application:

.. code-block:: shell

   docker-compose -f docker-compose-dev.yml up -d

Fourth, create database and initialise default collections and users:

.. code-block:: shell

   docker-compose -f docker-compose-dev.yml run web sh scripts/init.sh

Finally, see the site in action:

.. code-block:: shell

   firefox http://localhost:5000/

Recipes
=======

More recipes exist to accomodate some of your use-cases:

To run a recipe do:

.. code-block:: shell
   // Using local dev enviroment
   sh scripts/<recipe-file.sh>

   // Using docker enviroment
   docker-compose -f docker-compose-dev.yml run web sh scripts/<recipe-file.sh>

Existing recipes list:

.. code-block:: shell

    build-assets.sh // Collecting and Building Assets
    clean-and-init.sh // Drop, detroy everything and re-init DB, ES, data location, redis
    create-demo-users.sh  // Creates demo users for Admin, ALICE, ATLAS, CMS, LHCb
    init.sh // Init DB, ES, data location, redis
    init-db.sh // clean-and-init.sh + create-demo-users.sh

