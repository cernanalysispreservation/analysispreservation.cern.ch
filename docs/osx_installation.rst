Installation pre-requisites for MacOS
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


Step 3: NPM
-----------

NPM is the package manager of Node.js, used for the frontend. You will need to install it through brew, using

.. code-block:: shell

   brew install node

which will also install NPM for you. We will use it later to install and serve the frontend files.

