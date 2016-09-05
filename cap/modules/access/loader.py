"""CAP access permissions loader."""

from flask import current_app, session
from flask_login import current_user
from flask_principal import AnonymousIdentity, RoleNeed, identity_loaded
from werkzeug.local import LocalProxy

current_flask_security = LocalProxy(
    lambda: current_app.extensions['security']
)


@identity_loaded.connect
def update_identity(sender, identity):
    """Loads extra information for user"""
    if not isinstance(identity, AnonymousIdentity):
        if current_user.get_id() is not None:
            # Set the identity user object
            identity.user = current_user
            session_groups = identity.provides

            superuser_egroups = current_app.config.get('SUPERUSER_EGROUPS', [])
            superuser_roles = current_app.config.get('SUPERUSER_ROLES', {})

            if [i for i in superuser_egroups if i in session_groups]:
                identity.provides |= set(superuser_roles)

            collab_egroups = current_app.config.get('CAP_COLLAB_EGROUPS', {})
            for collab, egroups in collab_egroups.iteritems():
                if [i for i in egroups if i in session_groups]:
                    identity.provides |= set([RoleNeed(collab)])
