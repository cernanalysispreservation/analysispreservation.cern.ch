# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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
    'elasticsearch<3.0.0,>=2.0.0',  # temporary fix
    'elasticsearch-dsl<3.0.0,>=2.0.0',  # temporary fix
    'celery<4.0,>=3.1.19',  # temporary fix
    'cryptography>=1.6',  # temporary fix
    'gunicorn>=19.6.0',
    'setuptools>=20.6.7',  # temporary fix
    'py2neo==2.0.8',
    'simplejson>=3.8.2',
    'Flask>=0.11.1',
    'Shelves>=0.3.8',
    'Flask-CORS>=2.1.0',
    'Flask-BabelEx>=0.9.3',
    'Flask-Assets>=0.12',
    'Flask-Collect==1.2.2',
    'Flask-Cache>=0.13.1',
    'Flask-KVSession>=0.6.2',
    'Flask-Login==0.3.2',
    'Flask-WTF==0.13.1',
    'invenio-access>=1.0.0a11',
    'invenio-accounts>=1.0.0b1',
    'invenio-accounts-rest>=1.0.0a1',
    'invenio-assets>=1.0.0b6',
    'invenio-base>=1.0.0a14',
    'invenio-celery>=1.0.0b1',
    'invenio-collections>=1.0.0a3',
    'invenio-config>=1.0.0b1',
    'invenio-db[postgresql,versioning]>=1.0.0b3',
    'invenio-files-rest>=1.0.0a14',
    'invenio-indexer>=1.0.0a9',
    'invenio-deposit>=1.0.0a8',
    'invenio-jsonschemas>=1.0.0a3',
    'invenio-oauthclient>=1.0.0a11',
    'invenio-pages>=1.0.0a3',
    'invenio-pidstore>=1.0.0b1',
    # 'invenio-previewer==1.0.0a6',
    'invenio-records[postgresql]>=1.0.0b1',
    'invenio-records-files>=1.0.0a8',
    'invenio-records-rest>=1.0.0a17',
    'invenio-rest[cors]>=1.0.0a10',
    'invenio-search-ui>=1.0.0a5',
    'invenio-search>=1.0.0a9',
    'invenio-theme>=1.0.0a14',
    'invenio-userprofiles>=1.0.0a8',
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
        'cap.apps': [
            'invenio_jsonschemas = invenio_jsonschemas:InvenioJSONSchemas',
            'invenio_assets = invenio_assets:InvenioAssets',
            'invenio_i18n = invenio_i18n:InvenioI18N',
        ],
        'cap.blueprints': [
            'cap = cap.views:blueprint',
            'cap_theme = cap.views:theme_blueprint',
            'cap_search = cap.views:search_blueprint',
            'cap_deposit = cap.views:deposit_blueprint'
        ],
        # 'invenio_base.blueprints': [
        #     'cap = cap.views:blueprint',
        #     'cap_theme = cap.modules.theme.views:blueprint',
        #     'cap_experiments = '
        #     'cap.modules.experiments.views.rest:experiments_bp',
        #     'cap_csm = cap.modules.experiments.views.cms:cms_bp',
        #     'cap_lhcb = cap.modules.experiments.views.lhcb:lhcb_bp',
        #     'cap_atlas = cap.modules.experiments.views.atlas:atlas_bp',
        #     'cap_alice = cap.modules.experiments.views.alice:alice_bp',
        #     'cap_access = cap.modules.access.views:access_blueprint',
        #     'cap_deposit_ui = cap.modules.deposit.views.ui:blueprint',
        #     'cap_search_ui = cap.modules.search_ui.views:blueprint',
        # ],
        # 'invenio_base.apps': [
        #     'cap_access = cap.modules.access.ext:CAPAccess',
        #     'cap_cache = cap.modules.cache.ext:CAPCache',
        #     'cap_deposit = cap.modules.deposit.ext:CAPDeposit',
        #     'cap_fixtures = cap.modules.fixtures:CAPFixtures',
        # ],
        'invenio_base.api_apps': [
            'cap_access = cap.modules.access.ext:CAPAccess',
            'cap_cache = cap.modules.cache.ext:CAPCache',
            'cap_deposit = cap.modules.deposit.ext:CAPDeposit',
            'invenio_oauth = invenio_oauthclient.ext:InvenioOAuthClient',
            'invenio_i18n = invenio_i18n:InvenioI18N',
            'invenio_assets = invenio_assets:InvenioAssets',
        ],
        'invenio_base.api_blueprints': [
            'cap = cap.views:blueprint_static',
            'invenio_oauthclient = invenio_oauthclient.views.client:blueprint',
            'cap_user = cap.modules.user.views:user_blueprint',
            'cap_theme = cap.views:theme_blueprint',
            'cap_search = cap.views:search_blueprint',
            'cap_deposit = cap.views:deposit_blueprint'
        ],
        'invenio_assets.bundles': [
            'cap_app_js = cap.bundles:app_js',
            'cap_app_css = cap.bundles:app_css',
            'cap_forms_css = cap.bundles:forms_css',
            'cap_forms_js = cap.bundles:forms_js',
            'invenio_i18n_js = invenio_i18n.bundles:js',
            'invenio_theme_css = invenio_theme.bundles:css',
            'invenio_deposit_css = invenio_deposit.bundles:css',
            'invenio_deposit_dependencies_js = invenio_deposit.bundles:'
            'js_dependecies',
            'invenio_search_ui_search_css = invenio_search_ui.bundles:css',
            'invenio_search_ui_search_js = invenio_search_ui.bundles:js'
        ],
        'invenio_celery.tasks': [
            'cap_deposit = cap.modules.deposit.loaders',
        ],
        'invenio_pidstore.minters': [
            'cap_record_minter = '
            'cap.modules.records.minters:cap_record_minter',
        ],
        'invenio_pidstore.fetchers': [
            'cap_record_fetcher = '
            'cap.modules.records.fetchers:cap_record_fetcher',
        ],
        'invenio_records.jsonresolver': [
            'cap = cap.modules.records.resolvers.cap',
            'local = cap.modules.records.resolvers.local',
        ],
        'invenio_search.mappings': [
            'deposits = cap.mappings',
            'records = cap.mappings',
        ],
        'invenio_jsonschemas.schemas': [
            'cap_schemas = cap.jsonschemas',
        ],
    },
    extras_require=extras_require,
    install_requires=install_requires,
    setup_requires=setup_requires,
    tests_require=tests_require,
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: GNU General Public License v2 or later'
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
