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

from flask import current_app
from invenio_mail.api import TemplatedMessage
from jinja2.exceptions import TemplateNotFound, TemplateSyntaxError


def create_and_send(template, ctx, mail_ctx, plain=False):
    """Creates the mail using the invenio-mail template, and sends it."""
    if not current_app.config["CAP_SEND_MAIL"]:
        current_app.logger.info("Mail Error: Notifications disabled.")
        return

    if not any([mail_ctx["recipients"], mail_ctx["bcc"], mail_ctx["cc"]]):
        current_app.logger.error(
            f"Mail Error for analysis with the following information: {ctx}:\n"
            f"Empty recipient list."
        )
        return

    try:
        msg = (
            TemplatedMessage(template_body=template, ctx=ctx, **mail_ctx)
            if plain
            else TemplatedMessage(template_html=template, ctx=ctx, **mail_ctx)
        )

        current_app.extensions["mail"].send(msg)
    except TemplateNotFound as ex:
        _msg = (
            f"Mail::create_and_send - Template {ex.name} not found."
            f" Notification procedure aborted."
        )
        current_app.logger.error(_msg)
    except TemplateSyntaxError as ex:
        _msg = (
            f"Mail::create_and_send - Template error: {ex.message}."
            f" Notification procedure aborted."
        )
        current_app.logger.error(_msg)
    except TypeError:
        _msg = (
            "Mail::create_and_send - Context for template is empty."
            "Notification procedure aborted."
        )
        current_app.logger.error(_msg)
