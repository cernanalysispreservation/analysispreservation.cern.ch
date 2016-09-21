from flask import (Blueprint, abort,
                   render_template, g)
from flask.views import View
from flask_security import login_required
from cap.config import DEPOSIT_GROUPS
from flask_principal import RoleNeed
from invenio_access import DynamicPermission

blueprint = Blueprint(
    'cap_deposit_ui',
    __name__,
    template_folder='../templates',
    url_prefix='/deposit',
    static_folder='../static'
)


def create_blueprint():
    # Get DEPOSIT_GROUPS from configuration
    deposit_groups = DEPOSIT_GROUPS

    for group_name, group in deposit_groups.iteritems():
        blueprint.add_url_rule(
            '/{0}/new'.format(group_name),
            view_func=NewItemView.as_view(
                'deposit_item_new_{0}'.format(group_name),
                template_name=group.get('item_new_template', None),
                schema=group.get('schema', None),
                create_permission_roles=group.get(
                    'create_permission_roles', []),
                schema_form=group.get('schema_form', None),
            )
        )

        blueprint.add_url_rule(
            '/{0}'.format(group_name),
            view_func=ListView.as_view(
                'deposit_list_{0}'.format(group_name),
                template_name=group.get('list_template', None),
                schema=group.get('schema', None),
            )
        )

    return blueprint


@blueprint.app_template_filter('tolinksjs')
def to_links_js(pid, deposit=None):
    """Get API links."""

    self_url = current_app.config['DEPOSIT_RECORDS_API'].format(
        pid_value=pid.pid_value)

    return {
        'self': self_url,
        'html': url_for(
            'invenio_deposit_ui.{}'.format(pid.pid_type),
            pid_value=pid.pid_value),
        'discard': self_url + '/actions/discard',
        'edit': self_url + '/actions/edit',
        'publish': self_url + '/actions/publish',
    }


class NewItemView(View):

    def __init__(self,
                 template_name=None,
                 schema=None,
                 schema_form=None,
                 read_permission_factory=None,
                 create_permission_roles=[],
                 create_permission_factory=None,
                 update_permission_factory=None,
                 delete_permission_factory=None):

        self.template_name = template_name
        self.schema = schema
        self.schema_form = schema_form
        self.create_permission_roles = create_permission_roles
        self.read_permission_factory = read_permission_factory
        self.create_permission_factory = create_permission_factory
        self.update_permission_factory = update_permission_factory
        self.delete_permission_factory = delete_permission_factory

        create_permission_roles = set()
        if self.create_permission_roles:
            create_permission_roles = [RoleNeed(role)
                                       for role in self.create_permission_roles]
            self.create_permission = DynamicPermission(
                *create_permission_roles)
        else:
            self.create_permission = DynamicPermission(
                *create_permission_roles)

    def check_permissions(self):
        return self.create_permission.allows(g.identity)

    @login_required
    def render_template(self, context):
        return render_template(self.template_name, **context)

    def dispatch_request(self):
        if self.check_permissions():
            context = {
                "record": {'_deposit': {'id': None}},
                "schema": self.schema,
                "schema_form": self.schema_form,
            }
            return self.render_template(context)
        else:
            abort(403)


class ListView(View):

    def __init__(self,
                 template_name=None,
                 schema=None,
                 schema_form=None,
                 read_permission_factory=None,
                 create_permission_factory=None,
                 update_permission_factory=None,
                 delete_permission_factory=None):

        self.template_name = template_name
        self.schema = schema
        self.schema_form = schema_form
        self.read_permission_factory = read_permission_factory
        self.create_permission_factory = create_permission_factory
        self.update_permission_factory = update_permission_factory
        self.delete_permission_factory = delete_permission_factory

    def check_permissions(self):
        raise NotImplementedError()

    @login_required
    def render_template(self, context):
        return render_template(self.template_name, **context)

    def dispatch_request(self):
        context = {
            "schema": self.schema,
        }
        return self.render_template(context)
