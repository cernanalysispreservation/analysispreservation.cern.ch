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

"""Authentication views for CAP."""

from flask import Blueprint, url_for, current_app, jsonify, \
                  request, redirect, session, abort, render_template
from flask_login import current_user

from invenio_db import db
from invenio_userprofiles.models import UserProfile
from sqlalchemy.orm.attributes import flag_modified
from werkzeug.exceptions import HTTPException

from .config import OAUTH_SERVICES, USER_PROFILE
from .models import OAuth2Token
from .proxies import current_auth
from .utils import _create_or_update_token

from cap.modules.access.utils import login_required

blueprint = Blueprint(
    'cap_auth',
    __name__,
    url_prefix='/auth',
)


@blueprint.route('/connect/<name>')
@login_required
def connect(name):
    next_url = request.args.get('next')
    ui_flag = request.args.get('ui')
    session.update({
        'next': next_url,
        'ui': ui_flag
    })

    client = current_auth.create_client(name)
    redirect_uri = url_for('cap_auth.authorize', name=name, _external=True)

    if not current_app.config['DEBUG']:
        redirect_uri = redirect_uri.replace(
            "/auth/authorize/",
            "/api/auth/authorize/")

    # DEV FIX for 'CERN Gitlab' to work locally since you can't register
    # 'localhost' redirect_uri for testing
    #
    # redirect_uri = redirect_uri.replace(":5000", '')
    # redirect_uri = redirect_uri.replace("http", 'https')
    # redirect_uri = redirect_uri.replace("cern.ch/", 'cern.ch/api/')
    return client.authorize_redirect(redirect_uri)


@blueprint.route('/disconnect/<name>')
@login_required
def disconnect(name):
    _profile = UserProfile.get_by_userid(current_user.id)
    _token = OAuth2Token.get(name=name, user_id=current_user.id)

    if _profile and _token:
        del _profile.extra_data['services'][name]

        flag_modified(_profile, "extra_data")
        db.session.delete(_token)
        db.session.commit()

        return render_template(
            current_app.config['AUTH_SUCCESS_TEMPLATE'],
            **{
                'msg': f'Successfully disconnected from {name} service.'
            }), 200
    else:
        return render_template(
            current_app.config['AUTH_FAILURE_TEMPLATE'],
            **{
                'msg': f'Error: Unable to disconnect from {name} service.'
            }), 403


@blueprint.route('/authorize/<name>')
@login_required
def authorize(name):
    ui_flag = session.pop('ui', None)

    client = current_auth.create_client(name)
    try:
        token = client.authorize_access_token()
    except HTTPException:
        return render_template(
            current_app.config['AUTH_FAILURE_TEMPLATE'],
            **{
                'msg': f'Access not provided to {name} service.'
            }), 400

    configs = OAUTH_SERVICES.get(name.upper(), {})
    extra_data_method = configs.get('extra_data_method')

    # TOFIX Add error handlers for reject, auth errors, etc
    extra_data = {}
    if extra_data_method:
        extra_data = extra_data_method(client, token)

    _token = _create_or_update_token(name, token)
    _token.extra_data = extra_data

    db.session.add(_token)

    # Add extra data to user profile.
    # If user profile doesn't exist yet, it creates one.
    _profile = UserProfile.get_by_userid(current_user.id)
    if not _profile:
        _profile = UserProfile(user_id=current_user.id)
        db.session.add(_profile)

    profile_data = get_oauth_profile(name, token=_token, client=client)

    # TODO: Fix userprofiles in docker
    # if _profile.extra_data:
    #     profile_services = _profile.extra_data.get("services", {})
    # else:
    #     profile_services = {}
    profile_services = {}
    profile_services[name] = profile_data
    _profile.extra_data = {"services": profile_services}
    # flag_modified(_profile, "extra_data")

    db.session.commit()

    if ui_flag:
        return render_template(
            current_app.config['AUTH_SUCCESS_TEMPLATE'],
            **{
                'msg': f'Authorization to {name} succeeded.'
            }), 302
    else:
        return jsonify({
            "message": "Authorization to {} succeeded.".format(name)
        }), 200


@blueprint.route('/profile/<name>')
@login_required
def profile(name):
    _profile = get_oauth_profile(name)
    return jsonify(_profile)


def get_oauth_profile(name, token=None, client=None):
    _token = token if token \
        else OAuth2Token.get(name=name, user_id=current_user.id)

    if not _token:
        abort(403, "Your account is not connected to the service")

    extra_data = _token.extra_data
    _client = client if client else current_auth.create_client(name)

    if name == 'orcid':
        orcid = extra_data.get('orcid_id')
        resp = None
        if orcid:
            resp = _client.get('/{}/record'.format(orcid),
                               headers={'Accept': 'application/json'})
    else:
        resp = _client.get(USER_PROFILE[name]['path'])

    try:
        res_json = USER_PROFILE[name]['serializer'].dump(resp.json()).data
    except AttributeError:
        res_json = {}
    return res_json
