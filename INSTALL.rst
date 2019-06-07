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


=============================
Installation Guide for MacOS
=============================

This guide will explain how to install CAP (CERN Analysis Preservation) on a Mac system.

**Requirements:**

* Python 2.7
* Homebrew for some essential installations
* A working Docker instance (with the accompanying tools)
* Node.js / NPM for the UI package management


Step 1: Python and Homebrew
---------------------------

CAP uses Python 2.7, although it is strongly recommended to use brew to install your own Python instance. **DO NOT** delete the Python version found in the OS as this could lead to significant issues. Instead:

* Use brew to install Python, which will automatically create a Python 3 instance on your laptop. You can use it as your main version, and use a virtual environment for CAP.
* Create a virtual environment that has Python 2.7, which you can use without danger to the actual system.

Piece of advice: Use this command on your ``.bashrc`` or ``/.zshrc`` in order to use the installed Python 3 by default and avoid any dangerous mistakes.

.. code-block:: shell

   export PATH="/usr/local/opt/python/libexec/bin:/usr/local/sbin:$PATH"


For the purpose of this example we will need Python's virtual environments, using the virtualenvwrapper. After installing the project, found `here <https://virtualenvwrapper.readthedocs.io/en/latest/index.html#introduction/>`_, we can create a Python 2.7 virtual environment using the command:

.. code-block:: shell

   mkvirtualenv cap --python=python2.7


in which can be enter afterwards in order to deploy the project, using:

.. code-block:: shell

   workon cap


Step 2: Docker
--------------

You can install Docker, either using the .dmg file on the official web-site, or by, once again, using Homebrew. You will need to have available:

 * docker
 * docker-compose
 * docker-machine

 by yourself, or instead install the official docker package, which will link those commands in your terminal.


Using the command ``docker stats`` you can see if the instance is up and running, although it should return no stats without any images running. After you are done, using the next command, ``docker-compose run``, you will be able to see 4 services running on the docker stats terminal.

Last, you will need to add some variables to your system in tour ``~/.bashrc`` or ``~/.zshrc``, using the following:

.. code-block:: shell

   export DEBUG_MODE=True
   export ENABLE_BACKEND_PROXY=true


Step 3: NPM
-----------

NPM is the package manager of Node.js, used for the frontend. You will need to install it through brew, using

.. code-block:: shell

   brew install node

which will also install NPM for you. We will use it later to install and serve the frontend files.


Step 4: Install the project
---------------------------

Download the repository:

.. code-block:: shell

   git clone https://github.com/cernanalysispreservation/analysispreservation.cern.ch.git cap


and then you need to go into the CAP folder and install the Python requirements:

.. code-block:: shell

   cd cap

   pip install -r requirements.txt
   pip install -e .[all]
   pip install -r requirements-local-forks.txt


While still in the cap main folder, move to the folder of the UI assets using ``cd ui/`` and then ``npm install``


Finally, run the setup script ``./scripts/clean-and-init.sh``.


Step 5: Running the project
---------------------------

To run the backend, go back to the main ``cap`` path and use:

.. code-block:: shell

   cap run --reload

To run the the frontend:

.. code-block:: shell

    cd ui/
    npm start

You are ready to see the website in `action <http://localhost:3000>`_:


======================
Additional information
======================


If you are working in Linux, you may need those additional libraries for python-ldap:

.. code-block:: shell

   sudo apt-get install libsasl2-dev python-dev libldap2-dev libsasl2-dev


To use git hooks shared by our team:

.. code-block:: shell

    # Git version 2.9 or greater
    git config core.hooksPath .githooks

    # older versions
    find .git/hooks -type l -exec rm {} \;
    find .githooks -type f -exec ln -sf ../../{} .git/hooks/ \;


You can also use yarn instead of npm, with the exact same syntax, i.e. ``yarn install`` and ``yarn start``


**Database Migrations**

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


**Missing Requirements**

If you have trouble with the setup, check if you are missing one of the
following requirements, e.g. on Debian GNU/Linux:

.. code-block:: shell

   sudo apt-get install npm ruby gcc python-virtualenvwrapper

The version of Python 2 given by ``python --version`` or ``python2 --version`` should be greater than 2.7.10.


**Database Indexing Problems**

If you have trouble indexing the database try:

.. code-block:: shell

   cap db destroy
   cap db init

and if that does not work try:

.. code-block:: shell

   curl -XDELETE 'http://localhost:9200/_all'
   cap db init


**Docker Installation**

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


**Recipes**

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