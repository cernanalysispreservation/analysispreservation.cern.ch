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
from flask import current_app

from .attributes import generate_recipients, generate_subject, generate_body
from .custom.body import working_url
from .custom.subject import draft_id, published_id, revision
from .tasks import create_and_send
from .utils import is_review_request


def post_action_notifications(sender, action=None, pid=None, deposit=None):
    """
    Notification through mail, after specified deposit actions.
    The procedure followed to get the mail attrs will be described here:

    - Get the config for the action that triggered the receiver.
    - Through the configuration, retrieve the recipients, subject, body, and
      base template, and render them when needed.
    - Create the message and mail contexts (attributes), and pass them to
      the `create_and_send` task.
    """
    mail_sender = current_app.config.get('MAIL_DEFAULT_SENDER')
    if not mail_sender:
        current_app.logger.info('Mail Error: Sender not found.')
        return

    # in case of review, don't send mail on other related actions
    if not is_review_request():
        return

    action_configs = deposit.schema.config.get('notifications', {}) \
        .get('actions', {}) \
        .get(action, [])

    for config in action_configs:
        recipients, cc, bcc = generate_recipients(deposit, config, action)
        if not any([recipients, cc, bcc]):
            continue

        subject = generate_subject(deposit, config, action)
        body, base, plain = generate_body(deposit, config, action)

        mail_ctx = {
            'sender': mail_sender,
            'subject': subject,
            'recipients': recipients,
            'cc': cc,
            'bcc': bcc
        }

        # retrieve the most common Deposit/Record attributes, used in messages
        msg_ctx = {
            'published_id': published_id(deposit),
            'draft_id': draft_id(deposit),
            'revision': revision(deposit),
            'working_url': working_url(deposit),
            'message': body
        }

        create_and_send.delay(
            base, msg_ctx, mail_ctx,
            plain=plain
        )
