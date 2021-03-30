# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2021 CERN.
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
import re

from flask import current_app, request
from jinja2 import Environment, PackageLoader, select_autoescape
from jinja2.exceptions import TemplateNotFound, TemplateSyntaxError
from werkzeug.exceptions import BadRequest

from . import custom as custom_methods

# Creating new environment and new loader for the Jinja templates, to avoid
# injection with Flask context passed in render_template
_template_loader = PackageLoader("cap.modules.mail", "templates")
_mail_jinja_env = Environment(
    loader=_template_loader, autoescape=select_autoescape()
)

EMAIL_REGEX = re.compile(r"(?!.*\.\.)(^[^.][^@\s]+@[^@\s]+\.[^@\s.]+$)")

CONFIG_DEFAULTS = {
    "review": {
        "subject": "New review on document | CERN Analysis Preservation",
        "body": {
            "plain": ("mail/body/analysis_review.html", None),
            "html": ("mail/body/analysis_review.html", None),
        },
    },
    "publish": {
        "subject": "New published document | CERN Analysis Preservation",
        "body": {
            "plain": ("mail/body/analysis_published_plain.html", None),
            "html": ("mail/body/analysis_published.html", None),
        },
    },
}


class UnsuccessfulMail(Exception):
    """Error during sending email."""

    def __init__(self, **kwargs):
        """Initialize exception."""
        super(UnsuccessfulMail, self).__init__()
        self.rec_uuid = kwargs.get("rec_uuid", "")
        self.msg = kwargs.get("msg", "")
        self.params = kwargs.get("params", {})


def get_config_default(action, type, plain=False):
    """Get defaults for different actions/mail info."""
    return CONFIG_DEFAULTS.get(action, {}).get(type)


def path_value_equals(path, record):
    """Given a string path, retrieve the JSON item."""
    # TODO: better handle data iterations
    paths = path.split(".")
    data = record.dumps()
    try:
        for i in range(0, len(paths)):
            data = data[paths[i]]
        return data
    # TODO: better error handling
    except:  # noqa
        return None


def populate_template_from_ctx(
    record, config, module=None, type=None, default_ctx={}
):
    """
    Render a template according to the context provided in the schema.

    Args:
        record: The analysis record that has the necessary fields.
        config: The analysis config, provided in the `schema`.
        action: THe action that triggered the notification (e.g. `publish`).
        module: The file that will hold the custom created functions.
        type: The specific attribute that triggers this template, e.g.
              subject, message, etc

    Returns: The rendered string, using the required context values.
    """
    config_ctx = config.get("ctx", [])
    template = config.get("template")
    template_file = config.get("template_file")
    action = default_ctx.get("action", "")

    render = render_template
    if template:
        render = render_template_string
        template_to_render = template
    elif template_file:
        template_to_render = template_file
    else:
        if type == "body":
            mime_type = "plain" if config.get("plain") else "html"
            template_to_render = (
                CONFIG_DEFAULTS.get(action, {}).get(type, {}).get(mime_type)
            )
        else:
            template_to_render = CONFIG_DEFAULTS.get(action, {}).get(type, {})

    if not template_to_render:
        # if there is no `template_to_render` then abort
        # TODO: except if it is for recepients continue with next
        msg = (
            "Not template passed and no default templates found. "
            "Notification procedure aborted."
        )
        current_app.logger.error(msg)
        raise UnsuccessfulMail(
            rec_uuid=record.id, msg=msg, params={"config": config}
        )

    ctx = {**default_ctx}
    gen_ctx = generate_ctx(config_ctx, record=record, default_ctx=default_ctx)
    ctx = {**ctx, **gen_ctx}

    try:
        return render(template_to_render, **ctx)
    except TemplateNotFound as ex:
        msg = f"Template {ex.name} not found. Notification procedure aborted."
        raise UnsuccessfulMail(
            rec_uuid=record.id, msg=msg, params={"config": config}
        )
    except TemplateSyntaxError as ex:
        msg = f"Template error: {ex.message}. Notification procedure aborted."
        raise UnsuccessfulMail(
            rec_uuid=record.id, msg=msg, params={"config": config}
        )
    except TypeError:
        msg = "Context for template is empty. Notification procedure aborted."
        raise UnsuccessfulMail(
            rec_uuid=record.id, msg=msg, params={"config": config}
        )


def generate_ctx(config_ctx, record=None, default_ctx={}):
    ctx = {**default_ctx}
    for attrs in config_ctx:
        if attrs.get("path"):
            name = attrs["name"]
            val = path_value_equals(attrs["path"], record)
            ctx.update({name: val})
        elif attrs.get("method"):
            try:
                name = attrs["method"]
                custom_func = getattr(custom_methods, name)
                val = custom_func(record, default_ctx=default_ctx)
                ctx.update({name: val})
            except AttributeError:
                continue
    return ctx


def update_mail_list(record, config, mails, default_ctx={}):
    """
    Adds mails (default or formatted) in tha mails collection.

    An example of the expected config is this:
    "mails": {
        "default": [default1, default2],
        "formatted": [{
          "template": "template-mail-with-{{ var }}",
          "ctx": [{"name": "var", "path": "fields.field1"}]
        }]
    }
    """
    try:
        mails_list = config.get("default", [])
        formatted_list = config.get("formatted", [])
    except AttributeError:
        current_app.logger.error(
            "Mail configuration is not a dict with 'default', 'formatted' keys"
        )
        return

    if mails_list:
        mails += mails_list
    if formatted_list:
        for formatted in formatted_list:
            try:
                _formatted_email = populate_template_from_ctx(
                    record, formatted, type="recipient", default_ctx=default_ctx
                )
                mails += [_formatted_email]
            except UnsuccessfulMail:
                continue


def is_review_request():
    """
    On a review action, make sure that it is an actual review.

    On a review action, make sure that it is an actual review and not one
    of the accompanying actions (delete review, resolve review.
    """
    # TODO: check how to better handle, maybe send different messages
    not_permitted = ["resolve", "delete"]

    try:
        req = request.get_json()
        if isinstance(req, dict) and req.get("action") in not_permitted:
            return False
    except BadRequest:
        return False

    return True


def _render(template, context):
    """Renders the template and fires the signal."""
    rv = template.render(context)
    return rv


def render_template(template_name_or_list, **context):
    """Renders a template from the template folder with context.

    :param template_name_or_list: the name of the template to be
                                  rendered, or an iterable with template names
                                  the first one existing will be rendered
    :param context: the variables that should be available in the
                    context of the template.
    """
    return _render(
        _mail_jinja_env.get_or_select_template(template_name_or_list), context
    )


def render_template_string(source, **context):
    """Renders a template from the template string with context.

    Template variables will be autoescaped.

    :param source: the source code of the template to be
                   rendered
    :param context: the variables that should be available in the
                    context of the template.
    """
    return _render(_mail_jinja_env.from_string(source), context)
