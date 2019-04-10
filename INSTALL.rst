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

CERN Analysis Preservation is based on Invenio v3.0.

To run the services (ElasticSearch, RabbitMQ, PostgreSQL, Redis) simply do:

.. code-block:: shell

  docker-compose up

In your ~/.bash_profile or ~/.bashrc add:

.. code-block:: shell
  
  export DEBUG_MODE=True
  export ENABLE_BACKEND_PROXY=true

Finally install some required 3rd party libraries for python-ldap:

.. code-block:: shell
  
  sudo apt-get install libsasl2-dev python-dev libldap2-dev libsasl2-dev

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

Install the CAP package from inside your ``cap`` repository folder:

.. code-block:: shell

  pip install -r requirements.txt
  pip install -e .[all]
  pip install -r requirements-local-forks.txt

Install the required packages for UI:

.. code-block:: shell

  cd ui/
  npm install

or

.. code-block:: shell

  cd ui/
  yarn install


Finally run the setup and initialization script
``./scripts/clean-and-init.sh``.

Now you are ready to run the server.

Running the server
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To run the backend:
  
.. code-block:: shell
    
    cap run --reload

To run the the frontend:
    
.. code-block:: shell
    
    cd ui/
    npm start
  
or
  
.. code-block:: shell
    
    cd ui/
    yarn start

You are ready to see the website in `action <http://localhost:3000>`_:


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


Specify Python Version
~~~~~~~~~~~~~~~~~~~~~~

You can specify the python version for the virtual environment on
creation as follows (e.g. to use python 2.7):

.. code-block:: shell

   mkvirtualenv -p /usr/bin/python2.7 cap

Missing Requirements
~~~~~~~~~~~~~~~~~~~~

If you have trouble with the setup, check if you are missing one of the
following requirements, e.g. on Debian GNU/Linux:

.. code-block:: shell

   sudo apt-get install npm ruby gcc python-virtualenvwrapper

The version of Python 2 given by ``python --version`` or
``python2 --version`` should be greater than 2.7.10.

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

