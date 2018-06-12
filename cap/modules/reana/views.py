from flask import Blueprint, abort, current_app, jsonify
from werkzeug.local import LocalProxy

from flask_login import current_user
from flask_security import login_required
from invenio_pidstore.models import PersistentIdentifier, PIDDoesNotExistError

from .models import ReanaJob
from .serializers import ReanaJobSchema

reana_bp = Blueprint('cap_reana',
                     __name__,
                     url_prefix='/reana'
                     )


@reana_bp.route('/jobs/<pid>')
def get_current_user_jobs(pid=None):
    """Get reana jobs for current user and analysis with given id."""
    if not current_user.is_authenticated:
        abort(401)

    try:
        uuid = PersistentIdentifier.get('depid', pid).object_uuid   
    except PIDDoesNotExistError: 
        abort(404)

    jobs = ReanaJob.get_jobs(user_id=current_user.id,
                             record_id=uuid)
    schema = ReanaJobSchema()

    return jsonify([schema.dump(x).data for x in jobs])
