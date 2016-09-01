"""CAP access permissions loader."""

from flask_login import current_user
from flask_principal import identity_loaded
from flask import current_app
from flask_principal import AnonymousIdentity, RoleNeed


@identity_loaded.connect
def load_extra_info(sender, identity):
    """Loads extra information for user"""
    if isinstance(identity, AnonymousIdentity):
        return
    if current_user.get_id() is not None:
        groups = identity.provides
        superuser_egroups = current_app.config.get('SUPERUSER_EGROUPS', [])
        superuser_roles = current_app.config.get('SUPERUSER_ROLES', {})

        if [i for i in superuser_egroups if i in groups]:
            identity.provides |= set(superuser_roles)

        collab_egroups = current_app.config.get('CAP_COLLAB_EGROUPS', {})
        for collab, egroups in collab_egroups.iteritems():
            if [i for i in egroups if i in groups]:
                identity.provides |= set([RoleNeed(collab)])
