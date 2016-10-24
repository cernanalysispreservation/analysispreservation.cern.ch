# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

"""CERN Analysis Preservation Framework overlay repository for Invenio."""

import os
import sys

from setuptools import find_packages, setup

# readme = open('README.rst').read()
readme = ""
# history = open('CHANGES.rst').read()
history = ""
tests_require = [
    'check-manifest>=0.25',
    'coverage>=4.0',
    'isort>=4.2.2',
    'pydocstyle>=1.0.0',
    'pytest-cache>=1.0',
    'pytest-cov>=1.8.0',
    'pytest-pep8>=1.0.6',
    'pytest>=2.8.0',
    'mock>=2.0.0',
]

extras_require = {
    'docs': [
        'Sphinx>=1.3',
    ],
    'tests': tests_require,
}

extras_require['all'] = []
for reqs in extras_require.values():
    extras_require['all'].extend(reqs)

setup_requires = [
    'Babel>=1.3',
    'pytest-runner>=2.9',
]

install_requires = [
    'py2neo==2.0.8',
    'simplejson>=3.8.2',
    'Flask>=0.11.1',
    'Flask-CORS>=2.1.0',
    'Flask-BabelEx>=0.9.2',
    'Flask-Cache>=0.13.1',
    'Flask-KVSession>=0.6.2',
    'invenio-access>=1.0.0a9',
    'invenio-accounts>=1.0.0a15',
    'invenio-assets>=1.0.0b2',
    'invenio-base>=1.0.0a14',
    'invenio-collections>=1.0.0a3',
    'invenio-config>=1.0.0b1',
    'invenio-db[postgresql,versioning]>=1.0.0b1',
    'invenio-files-rest>=1.0.0a12',
    'invenio-deposit>=1.0.0a6',
    'invenio-indexer>=1.0.0a6',
    'invenio-jsonschemas>=1.0.0a3',
    'invenio-oauthclient>=1.0.0a9',
    'invenio-pages>=1.0.0a3',
    'invenio-pidstore>=1.0.0a9',
    'invenio-previewer==1.0.0a6',
    'invenio-records-files>=1.0.0a7',
    'invenio-records-rest>=1.0.0a16',
    'invenio-records-ui>=1.0.0a7',
    'invenio-records>=1.0.0a17',
    'invenio-rest[cors]>=1.0.0a8',
    'invenio-search-ui>=1.0.0a5',
    'invenio-search>=1.0.0a8',
    'invenio-search-ui>=1.0.0a5',
    'invenio-theme>=1.0.0a14',
    'invenio-userprofiles>=1.0.0a7',
]


packages = find_packages()

# Get the version string. Cannot be done with import!
g = {}
with open(os.path.join('cap', 'version.py'), 'rt') as fp:
    exec(fp.read(), g)
    version = g['__version__']

setup(
    name='cap',
    version=version,
    description=__doc__,
    long_description=readme + '\n\n' + history,
    keywords='cap cern analysis preservation',
    license='GPLv2+',
    author='CERN',
    author_email='info@inveniosoftware.org',
    url='https://github.com/analysispreservationcernch',
    packages=packages,
    zip_safe=False,
    include_package_data=True,
    platforms='any',
    entry_points={
        'console_scripts': [
            'cap = cap.cli:cli',
        ],
        'invenio_base.blueprints': [
            'cap = cap.views:blueprint',
            'cap_theme = cap.modules.theme.views:blueprint',
            'cap_experiments = cap.modules.experiments.views.rest:experiments_bp',
            'cap_csm = cap.modules.experiments.views.cms:cms_bp',
            'cap_lhcb = cap.modules.experiments.views.lhcb:lhcb_bp',
            'cap_atlas = cap.modules.experiments.views.atlas:atlas_bp',
            'cap_alice = cap.modules.experiments.views.alice:alice_bp',
            'cap_alpaca = cap.modules.alpaca.views:blueprint',
            'cap_access = cap.modules.access.views:access_blueprint',
            'cap_deposit_ui = cap.modules.deposit.views.ui:blueprint',
        ],
        # 'invenio_i18n.translations': [
        #     'messages = cap',
        # ],
        'invenio_base.apps': [
            'cap_access = cap.modules.access.ext:CAPAccess',
            'cap_cache = cap.modules.cache.ext:CAPCache',
            'cap_deposit = cap.modules.deposit.ext:CAPDeposit',
            'cap_fixtures = cap.modules.fixtures:CAPFixtures',
            'cap_jsonschemas = cap.modules.jsonschemas:CAPJSONschemas',
            'cap_records = cap.modules.records.ext:Records',
        ],
        'invenio_base.api_apps': [
            'cap_access = cap.modules.access.ext:CAPAccess',
            'cap_cache = cap.modules.cache.ext:CAPCache',
            'invenio_oauth = invenio_oauthclient.ext:InvenioOAuthClient',
        ],
        'invenio_access.actions': [
        ],
        'invenio_assets.bundles': [
            'cap_theme_css = cap.modules.theme.bundles:css',
            'cap_theme_js = cap.modules.theme.bundles:js',
            'cap_theme_front_css = cap.modules.theme.bundles:front_css',
            'cap_theme_front_js = cap.modules.theme.bundles:front_js',
            'cap_theme_records_js = cap.modules.theme.bundles:records',
            'cap_cms_js = cap.modules.experiments.bundles:cms_js',
            'cap_lhcb_js = cap.modules.experiments.bundles:lhcb_js',
            'cap_atlas_js = cap.modules.experiments.bundles:atlas_js',
            'cap_alice_js = cap.modules.experiments.bundles:alice_js',
            'cap_alpaca_display_css = cap.modules.alpaca.bundles:display_css',
            'cap_alpaca_display_js = cap.modules.alpaca.bundles:display_js',
            'cap_alpaca_create_js = cap.modules.alpaca.bundles:create_js',
            'cap_alpaca_edit_js = cap.modules.alpaca.bundles:edit_js',
            'cap_alpaca_edit_css = cap.modules.alpaca.bundles:edit_css',
            'cap_search_js = cap.modules.theme.bundles:search_js',
            'cap_experiments_js = '
            'cap.modules.experiments.bundles:experiments_js',
            'cap_experiments_css = '
            'cap.modules.experiments.bundles:experiments_css',
        ],
        'invenio_pidstore.minters': [
            'cap_record_minter = '
            'cap.modules.records.minters:cap_record_minter',
            'cap_deposit_minter = '
            'cap.modules.deposit.minters:cap_deposit_minter',
        ],
        'invenio_pidstore.fetchers': [
            'cap_record_fetcher = '
            'cap.modules.records.fetchers:cap_record_fetcher',
            'cap_deposit_fetcher = '
            'cap.modules.deposit.fetchers:cap_deposit_fetcher',
        ],
        'invenio_records.jsonresolver': [
            'jsonresolver = cap.modules.records.resolvers.jsonschemas',
        ],
        'invenio_search.mappings': [
            'deposits = cap.mappings',
            'records = cap.mappings',
        ],
        'invenio_jsonschemas.schemas': [
            'cap = cap.jsonschemas',
        ],
    },
    extras_require=extras_require,
    install_requires=install_requires,
    setup_requires=setup_requires,
    tests_require=tests_require,
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: GNU General Public License v2 or later'\
        '(GPLv2+)',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Development Status :: 1 - Planning',
    ],
)
