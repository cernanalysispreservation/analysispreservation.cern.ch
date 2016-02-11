from invenio_access.models import ActionRoles, ActionUsers
from invenio_access.permissions import DynamicPermission
from invenio_records.permissions import RecordReadActionNeed


def read_permission_factory(record):
    """Factory for creating read permissions for records."""
    permission = DynamicPermission(RecordReadActionNeed(str(record.id)))

    old_can = permission.can

    def new_can():
        is_public = ActionUsers.query.filter(
            ActionUsers.action == 'records-read',
            ActionUsers.argument == str(record.id),
            ActionUsers.user_id.is_(None)).first()

        if is_public or old_can():
            return True
        else:
            return False

    permission.can = new_can

    return permission
