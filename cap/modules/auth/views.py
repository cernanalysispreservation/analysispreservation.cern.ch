from flask import url_for, render_template

from flask import Blueprint, current_app, jsonify, request, redirect
from flask_login import login_required, current_user
from invenio_db import db
from sqlalchemy.orm.attributes import flag_modified

import json
from .proxies import current_auth
from .models import OAuth2Token

from invenio_userprofiles.models import UserProfile
from .config import OAUTH_SERVICES

blueprint = Blueprint(
    'cap_auth',
    __name__,
    url_prefix='/auth',
)

def ANAUTHORIZED_MSG(name):
    return  "You need to be logged in to connect your account with '{}'" \
            .format(name)

@blueprint.route('/connect/<name>')
def connect(name):
    if not current_user.is_authenticated:
        return jsonify({"error": ANAUTHORIZED_MSG(name)}), 403
    client = current_auth.create_client(name)
    redirect_uri = url_for('cap_auth.authorize', name=name, _external=True)
    return client.authorize_redirect(redirect_uri)

@blueprint.route('/authorize/<name>')
def authorize(name):
    if not current_user.is_authenticated:
        return jsonify({"error": ANAUTHORIZED_MSG(name)}), 403

    client = current_auth.create_client(name)
    token = client.authorize_access_token()

    configs = OAUTH_SERVICES.get(name.upper(), {})
    extra_data_method = configs.get('extra_data_method')
    profile_method = configs.get('profile_method')

    extra_data = {}
    if (extra_data_method):
        extra_data = extra_data_method(client, token)

    _token = OAuth2Token.get(name=name, user_id=current_user.id)
    if not _token:
        _token = OAuth2Token(name=name, user_id=current_user.id)
    _token.token_type = token.get('token_type', 'bearer')
    _token.access_token = token.get('access_token')
    _token.refresh_token = token.get('refresh_token')
    _token.expires_at = token.get('expires_at', 0)
    _token.expires_in = token.get('expires_in', 0)
    _token.extra_data = extra_data
    db.session.add(_token)

    if (get_oauth_profile):
        profile = UserProfile.get_by_userid(current_user.id)
        if not profile:
            profile = UserProfile(user_id=current_user.id)
            db.session.add(profile)

        profile_data = get_oauth_profile(name)

        profile_services = profile.extra_data.get("services", {})
        profile_services[name] = profile_data
        profile.extra_data = {"services": profile_services}
        flag_modified(profile, "extra_data")

    db.session.commit()

    return jsonify({"message": "Authorization to {} succeeded".format(name)}), 200

@blueprint.route('/profile/<name>')
def profile(name):
    if not current_user.is_authenticated:
        return jsonify({"error": ANAUTHORIZED_MSG(name)}), 403

    _token = OAuth2Token.get(name=name, user_id=current_user.id)
    if not _token:
        return jsonify({"message":"Your account is not connected to the service"}), 403

    extra_data = _token.extra_data
    client = current_auth.create_client(name)

    if name == "github":
        resp = client.get("/user")
    elif name == "zenodo":
        resp = client.get("api/")
    elif name == "cern":
        resp = client.get("Me")
    elif name == "orcid":
        orcid_id = extra_data.get('orcid_id')
        if orcid_id:
            resp = client.get("/{}/record".format(orcid_id),
                              headers={ 'Accept': 'application/json' })
    
    if resp:
        profile = resp.json()

    return jsonify(profile)


def get_oauth_profile(name):
    if not current_user.is_authenticated:
        return None

    _token = OAuth2Token.get(name=name, user_id=current_user.id)
    if not _token:
        return jsonify({"message":"Your account is not connected to the service"}), 403

    extra_data = _token.extra_data
    client = current_auth.create_client(name)

    if name == "github":
        resp = client.get("/user")
    elif name == "zenodo":
        resp = client.get("api/")
    elif name == "cern":
        resp = client.get("Me")
    elif name == "orcid":
        orcid_id = extra_data.get('orcid_id')
        if orcid_id:
            resp = client.get("/{}/record".format(orcid_id),
                              headers={ 'Accept': 'application/json' })
    
    if resp:
        profile = resp.json()

    return profile
