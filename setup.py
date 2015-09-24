# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2014, 2015 CERN.
#
# CERN Analysis Preservation Framework is free software; you can
# redistribute it and/or modify it under the terms of the GNU General
# Public License as published by the Free Software Foundation; either
# version 2 of the License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that
# it will be useful, but WITHOUT ANY WARRANTY; without even the
# implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
# PURPOSE.  See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this software; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307,
# USA.

"""
Invenio Data
------------

Data repository.
"""

import os

from setuptools import find_packages, setup


# Load __version__, should not be done using import.
# http://python-packaging-user-guide.readthedocs.org/en/latest/development.html#single-sourcing-the-version
g = {}
with open(os.path.join('invenio_data', 'version.py'), 'rt') as fp:
    exec(fp.read(), g)
version = g['__version__']

setup(
    name='Invenio-Data',
    version=version,
    url='https://github.com/inveniosoftware/invenio',
    license='GPLv2',
    author='CERN',
    author_email='info@invenio-software.org',
    description=__doc__,
    long_description=open('README.rst', 'rt').read(),
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    platforms='any',
    install_requires=[
        'Invenio>=2.1',
        'invenio-jsonschemas>=0.1.0',
    ],
    extras_require={
        'development': [
            'Flask-DebugToolbar>=0.9',
            'setuptools-bower>=0.2'
        ],
    },
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: GPLv2 License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
    entry_points={
        'invenio.config': [
            'invenio_data = invenio_data.config'
        ]
    },
    test_suite='nose.collector',
    tests_require=[
        'nose',
        'Flask-Testing'
    ]
)
