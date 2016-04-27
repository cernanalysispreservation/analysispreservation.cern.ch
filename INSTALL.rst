..  This file is part of Invenio
    Copyright (C) 2014 CERN.

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

Detailed installation guide
===========================

.. admonition:: CAVEAT LECTOR

   Invenio v3.0 alpha is a bleeding-edge developer preview version that is
   scheduled for public release in Q1/2016.

Prerequisites
-------------

Invenio v3.0 needs several prerequisite software packages to function:

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

and do a system install for the Sass preprocessor by following `Sass web guide <http://sass-lang.com/install>`_ and running:

.. code-block:: shell

  sudo npm -g sass


Installation
------------

Let's start by creating a new virtual environment that will hold our CAP
v3.0 instance:

.. code-block:: shell

   mkvirtualenv cap

Install CAP package:

.. code-block:: shell

   cdvirtualenv
   mkdir src && cd src
   git clone https://github.com/cernanalysispreservation/analysis-preservation.cern.ch.git cap
   cd cap
   pip install -r requirements.txt

Add the following lines in your "elasticsearch.yml":

.. code-block:: shell

  # MY CONFIGS

  cluster.name: cap
  discovery.zen.ping.multicast.enabled: false
  http.port: 9200
  http.publish_port: 9200

Run npm to install any necessary JavaScript assets the Invenio modules
depend on:

.. code-block:: shell

   cd cap
   python manage.py npm
   cdvirtualenv var/cap-instance/static
   npm install bower
   npm install
   cd node_modules/alpaca
   npm install gulp gulp-clean

   npm install
   npm start
   cdvirtualenv src/cap
   python manage.py collect -v
   python manage.py assets build

Create database to hold persistent data:

.. code-block:: shell

   python manage.py db init
   python manage.py db create

Create a user account:

.. code-block:: shell

   python manage.py users create info@inveniosoftware.org -a

Create some basic collections:

.. code-block:: shell

   python manage.py collections create CERNAnalysisPreservation
   python manage.py collections create CMS -p CERNAnalysisPreservation
   python manage.py collections create CMSQuestionnaire -p CMS -q '_type:cmsquestionnaire'
   python manage.py collections create CMSAnalysis -p CMS -q '_type:cmsanalysis'
   python manage.py collections create LHCb -p CERNAnalysisPreservation
   python manage.py collections create LHCbAnalysis -p LHCb -q '_type:lhcbanalysis'
   python manage.py collections create ATLAS -p CERNAnalysisPreservation
   python manage.py collections create ATLASWorkflows -p ATLAS '_type:atlasworkflows'
   python manage.py collections create ALICE -p CERNAnalysisPreservation

Start Elasticsearch in the background:

.. code-block:: shell

   elasticsearch &

Create the index in ElasticSearch using the mappings:

.. code-block:: shell

   python manage.py index init

Start the web application (in debugging mode):

.. code-block:: shell

   python manage.py --debug run


Now we can create our first record by going to ``http://localhost:5000/records/<collection_name>/create/``

  ex. ``http://localhost:5000/records/CMS/create/`` which creates the record and takes you to the record page