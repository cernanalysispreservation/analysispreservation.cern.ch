from flask import Blueprint, url_for, current_app, jsonify, \
                  request, redirect, session
from flask_login import current_user

from cap.modules.access.utils import login_required

from invenio_db import db
from sqlalchemy.orm.attributes import flag_modified

from .proxies import current_auth
from .models import OAuth2Token

from invenio_userprofiles.models import UserProfile
from .config import OAUTH_SERVICES
from .utils import _create_or_update_token

blueprint = Blueprint(
    'cap_auth',
    __name__,
    url_prefix='/auth',
)


@blueprint.route('/connect/<name>')
@login_required
def connect(name):
    next_url = request.args.get('next')
    session['next'] = next_url or None
    ui_flag = request.args.get('ui')
    session['ui'] = ui_flag or None

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


@blueprint.route('/authorize/<name>')
@login_required
def authorize(name):
    ui_flag = session.pop('ui', None)

    client = current_auth.create_client(name)
    token = client.authorize_access_token()

    configs = OAUTH_SERVICES.get(name.upper(), {})
    extra_data_method = configs.get('extra_data_method')

    # TOFIX Add error handlers for reject, auth errors, etc
    extra_data = {}
    if (extra_data_method):
        extra_data = extra_data_method(client, token)

    _token = _create_or_update_token(name, token)
    _token.extra_data = extra_data

    db.session.add(_token)

    # Add extra data to user profile.
    # If user profile doesn't exist yet, it creates one.
    profile = UserProfile.get_by_userid(current_user.id)
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.session.add(profile)

    profile_data = get_oauth_profile(name, token=_token, client=client)

    if profile.extra_data:
        profile_services = profile.extra_data.get("services", {})
    else:
        profile_services = {}
    profile_services[name] = profile_data
    profile.extra_data = {"services": profile_services}
    flag_modified(profile, "extra_data")

    db.session.commit()

    if ui_flag:
        if current_app.config['DEBUG']:
            redirect_url = "http://localhost:3000/settings/auth/connect"
        else:
            redirect_url = "/settings/auth/connect"
        return redirect(redirect_url)
    else:
        return jsonify({
            "message": "Authorization to {} succeeded".format(name)
        }), 200


@blueprint.route('/profile/<name>')
@login_required
def profile(name):
    profile = get_oauth_profile(name)

    return jsonify(profile)


def get_oauth_profile(name, token=None, client=None):
    if token:
        _token = token
    else:
        _token = OAuth2Token.get(name=name, user_id=current_user.id)

    if not _token:
        return jsonify({"message":
                        "Your account is not connected to the service"}), 403

    extra_data = _token.extra_data

    if client:
        _client = client
    else:
        _client = current_auth.create_client(name)

    # return the user profile based on the service
    user_path = {
        'github': '/user',
        'gitlab': 'user',
        'zenodo': 'api/',
        'cern': 'Me'
    }

    if name == 'orcid':
        orcid_id = extra_data.get('orcid_id')
        resp = _client.get("/{}/record".format(orcid_id),
                           headers={'Accept': 'application/json'}) \
            if orcid_id else None
    else:
        resp = _client.get(user_path[name])

    return resp.json() if resp else {}
