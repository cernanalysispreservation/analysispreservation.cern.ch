README
======

To build this documentation with Sphinx you have to follow a few simple steps.

Setup the Environment
---------------------

If you only want to build the docs and you do not want to run the code or you want to keep these tasks in seperate environments, continue with the following.

First, install the necessary requirements:

.. code-block:: console

    python python-virtualenvwrapper

Second, clone the repository (or your own fork) if you have not done so already:

.. code-block:: console

    git clone https://github.com/cernanalysispreservation/analysis-preservation.cern.ch.git cap

Third, create the virtual environment:

.. code-block:: console

    mkvirtualenv -p /usr/bin/python2.7 capdocs

and install Sphinx:

.. code-block:: console

    pip install Sphinx

Now you are all set. Whenever you want to build your docs in the future, just follow the below instructions.

Build the Docs
--------------

To build the docs, switch into the docs folder inside your repository folder

.. code-block:: console

    cd ~/PATH_TO_YOUR_CLONED_FOLDER/cap/docs

and run

.. code-block:: console

    make html

If that does not work and you do not see the ``(capdocs)`` in your terminal as such:

.. code-block:: console

    (capdocs) [USER@COMPUTER cap]$

then do the following:

.. code-block:: console

    workon capdocs
    make html
