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
#

# HOW TO USE
# ==========
#
# Authlib's Flask OAuth registry can load the configuration from
# Flask app.config automatically
# Check: https://docs.authlib.org/en/latest/client/flask.html#configuration
# They can be configured in your Flask App configuration
# Config key is formatted with {name}_{key} in uppercase, e.g.

# EXAMPLE_CLIENT_ID	OAuth Consumer Key
# EXAMPLE_CLIENT_SECRET	OAuth Consumer Secret
# or for Invenio purposes, like
# INVENIO_EXAMPLE_CLIENT_ID	OAuth Consumer Key
# INVENIO_EXAMPLE_CLIENT_SECRET	OAuth Consumer Secret

from .serializers import GitHubLoginSchema, GitLabLoginSchema, \
    OrcidLoginSchema, ZenodoLoginSchema, CERNProfileSchema


def orcid_extra_data(client, token):
    return {"orcid_name": token.get("name"), "orcid_id": token.get("orcid")}


OAUTH_SERVICES = {
    "GITHUB":
    dict(
        name='github',
        access_token_url='https://github.com/login/oauth/access_token',
        authorize_url='https://github.com/login/oauth/authorize',
        api_base_url='https://api.github.com/',
        client_kwargs={'scope': 'repo,public_repo:,admin:org_hook'},
    ),
    "ZENODO":
    dict(
        name='zenodo',
        access_token_url='https://zenodo.org/oauth/token',
        authorize_url='https://zenodo.org/oauth/authorize',
        api_base_url='https://zenodo.org/',
        client_kwargs={
            'scope': 'deposit:write deposit:actions',
            'token_endpoint_auth_method': 'client_secret_post',
            'token_placement': 'uri'
        },
    ),
    "GITLAB":
    dict(
        name='gitlab',
        access_token_url='https://gitlab.cern.ch/oauth/token',
        authorize_url='https://gitlab.cern.ch/oauth/authorize',
        api_base_url='https://gitlab.cern.ch/api/v4/',
        client_kwargs={'scope': 'api'},
    ),

    # used exclusively for testing
    # "GITLAB-TEST":
    # dict(
    #     name='gitlab',
    #     access_token_url='https://gitlab-test.cern.ch/oauth/token',
    #     authorize_url='https://gitlab-test.cern.ch/oauth/authorize',
    #     api_base_url='https://gitlab-test.cern.ch/api/v4/',
    #     client_kwargs={'scope': 'api'},
    # ),
    # *** Using invenio-oauthclient for CERN ***
    #
    # "CERN": dict(
    #     name='cern',
    #     access_token_url='https://oauth.web.cern.ch/OAuth/Token',
    #     authorize_url='https://oauth.web.cern.ch/OAuth/Authorize',
    #     api_base_url='https://oauthresource.web.cern.ch/api/',
    #     client_kwargs={
    #         'scope': 'read:user',
    #         'token_endpoint_auth_method': 'client_secret_post',
    #     }
    # ),
    "CERN":
    dict(
        name='cern',
        server_metadata_url='https://auth.cern.ch/auth/realms/cern'
        '/.well-known/openid-configuration',
        issuer='https://auth.cern.ch/auth/realms/cern',
        authorization_endpoint='https://auth.cern.ch/auth/realms/cern'
                               '/protocol/openid-connect/auth',
        token_endpoint='https://auth.cern.ch/auth/realms/cern'
                       '/protocol/openid-connect/token',
        token_introspection_endpoint='https://auth.cern.ch/auth/realms/cern'
                                     '/protocol/openid-connect/'
                                     'token/introspect',
        userinfo_endpoint='https://auth.cern.ch/auth/realms/cern'
                          '/protocol/openid-connect/userinfo',
        end_session_endpoint='https://auth.cern.ch/auth/realms/cern'
                             '/protocol/openid-connect/logout',
        jwks_uri='https://auth.cern.ch/auth/realms/cern'
                 '/protocol/openid-connect/certs',
        client_kwargs={
            'scope': 'openid profile email cern-login-info offline_access',
        }),
    "ORCID":
    dict(
        name='orcid',
        access_token_url='https://orcid.org/oauth/token',
        authorize_url='https://orcid.org/oauth/authorize',
        api_base_url='https://pub.orcid.org/v2.0',
        client_kwargs={
            'scope': '/authenticate',
            'token_endpoint_auth_method': 'client_secret_post'
        },
        extra_data_method=orcid_extra_data
    )
}

#: CERN OIDC Auth endpoints
OIDC_API = {
    'ACCOUNT':
        'https://authorization-service-api.web.cern.ch/api/v1.0/Account',
    'GROUP':
        'https://authorization-service-api.web.cern.ch/api/v1.0/Group',
    'TOKEN':
        'https://auth.cern.ch/auth/realms/cern/api-access/token'
}

# return the user profile based on the service
USER_PROFILE = {
    'github': {
        'path': '/user',
        'serializer': GitHubLoginSchema()
    },
    'gitlab': {
        'path': 'user',
        'serializer': GitLabLoginSchema()
    },
    'zenodo': {
        'path': 'api/',
        'serializer': ZenodoLoginSchema()
    },
    'cern': {
        'path': 'Me',
        'serializer': CERNProfileSchema()
    },
    'orcid': {
        'serializer': OrcidLoginSchema()
    }
}
