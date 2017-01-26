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
of CERN Analysis Preservation, one with python virtualenvwrapper and one
with docker.


1. Bare Installation
====================

CERN Analysis Preservation is based on Invenio v3.0 alpha.

1.1 Prerequisites
-----------------

Invenio v3.0 requires some additional software packages:

- `Elasticsearch <https://www.elastic.co/products/elasticsearch>`_
- `PostgreSQL <http://www.postgresql.org/>`_
- `RabbitMQ <http://www.rabbitmq.com/>`_
- `Redis <http://redis.io/>`_

For example, on Debian GNU/Linux, you can install them as follows:

.. code-block:: shell

   sudo apt-get install elasticsearch \
                        postgresql \
                        rabbitmq-server \
                        redis-server

Now, add the following lines in your "elasticsearch.yml" (for
Debian GNU/Linux the full path is
``/etc/elasticsearch/elasticsearch.yml``):

.. code-block:: shell

  # MY CONFIGS

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

1.2 Installation
----------------

Let's start by cloning the repository:

.. code-block:: shell

   git clone https://github.com/cernanalysispreservation/analysis-preservation.cern.ch.git cap

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

Start redis server in the background:

.. code-block:: shell

   redis-server &

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

Create database to hold persistent data:

.. code-block:: shell

   cap db init
   cap db create

Create a user account:

.. code-block:: shell

   cap users create info@inveniosoftware.org -a

Add Elasticsearch plugins:

.. code-block:: shell

   /tmp/elasticsearch/bin/plugin install -b mapper-attachments

Create some basic collections:

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

Start Elasticsearch in the background:

.. code-block:: shell

   elasticsearch &

Create the index in ElasticSearch using the mappings:

.. code-block:: shell

   cap index init

Start the web application in debug mode:

.. code-block:: shell

   gunicorn -b :5000 --log-level debug cap.wsgi:application

Now you can create your first record by going to ``http://localhost:5000/records/<collection_name>/create/``

  ex. ``http://localhost:5000/records/CMS/create/`` which creates the record and takes you to the record page


1.3 Compiling JSON-schemas to be use by CAP instance
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

For CERN Analysis Preservation instance to work ( records, deposits, validations, etc) we need to compile the schemas to a format that can be utilised by the various 'comsumers'

To compile the schemas do:

.. code-block:: shell

   # NOTICE: At this point order of commands is important [TODO]
   # For record schemas
   cap schemas compilerecord

   # For deposits schemas
   cap schemas compiledeposit


1.4 Populating the Database with Example Records
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
If you want to populate the database with example records simply run:

.. code-block:: shell

   # For creating demo records with schema validation
   cap fixtures records

   # For creating demo records without validation ( --force )
   cap fixtures records -f

1.5 General Recommendations
~~~~~~~~~~~~~~~~~~~~~~~~~~~

1.5.1 Specify Python Version
""""""""""""""""""""""""""""

You can specify the python version for the virtual environment on
creation as follows (e.g. to use python 2.7):

.. code-block:: shell

   mkvirtualenv -p /usr/bin/python2.7 cap

1.5.2 Local Installation of npms and gems
"""""""""""""""""""""""""""""""""""""""""

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

1.6 Troubleshooting
~~~~~~~~~~~~~~~~~~~

1.6.1 Missing Requirements
""""""""""""""""""""""""""
If you have trouble with the setup, check if you are missing one of the
following requirements:

.. code-block:: shell

   npm ruby gcc python-virtualenvwrapper

The version of python2 given by ``python2 --version`` should be greater
than 2.7.10.

1.6.2 Non-matching Requirements
"""""""""""""""""""""""""""""""
If you encounter a problem with requirements that do not match it may
be because the python eggs are not included in your virtualenv and you
will have to update them running:

.. code-block:: shell

   pip install -r requirements.txt

1.6.3 Database Indexing Problems
""""""""""""""""""""""""""""""""
If you have trouble indexing the database try:

.. code-block:: shell

   cap db destroy
   cap db init

and if that does not work try:

.. code-block:: shell

   curl -XDELETE 'http://localhost:9200/_all'
   cap db init


2. Docker Installation
======================

First, install ``docker-engine`` and ``docker-compose`` on your machine.

Second, build the CERN Analysis Preservation images, using the development
configuration:

.. code-block:: shell

   docker-compose -f docker-compose-dev.yml build

Third, start the CERN Analysis Preservation application:

.. code-block:: shell

   docker-compose -f docker-compose-dev.yml up -d

Fourth, create database and initialise default collections and users:

.. code-block:: shell

   docker exec -i -t analysispreservationcernch_web_1 /code/scripts/init.sh

Fifth, populate the database with some example records (optional):

.. code-block:: shell

   docker exec -i -t analysispreservationcernch_web_1 cap fixtures records -f

Finally, see the site in action:

.. code-block:: shell

   firefox http://localhost/
