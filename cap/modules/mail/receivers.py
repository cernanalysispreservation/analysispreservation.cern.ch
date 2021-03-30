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
from celery import shared_task
from flask import current_app
from flask_login import current_user

from cap.modules.deposit.api import CAPDeposit

from .attributes import generate_body, generate_recipients, generate_subject
from .custom.body import working_url
from .custom.subject import draft_id, published_id, revision
from .tasks import create_and_send
from .utils import UnsuccessfulMail, generate_ctx, is_review_request


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
    if not is_review_request():
        return

    action_notifications_config = (
        deposit.schema.config.get('notifications', {})
        .get('actions', {})
        .get(action, [])
    )
    current_user_id = current_user.id
    if action_notifications_config:
        send_deposit_notifications(str(deposit.id), current_user_id, action)


@shared_task(ignore_result=True)
def send_deposit_notifications(record_uuid, user_id, action):
    """
    Notification through mail, after specified deposit actions.

    The procedure followed to get the mail attrs will be described here:

    - Get the config for the action that triggered the receiver.
    - Through the configuration, retrieve the recipients, subject, body, and
      base template, and render them when needed.
    - Create the message and mail contexts (attributes), and pass them to
      the `create_and_send` task.
    """
    deposit = CAPDeposit.get_record(record_uuid)

    mail_sender = current_app.config.get('MAIL_DEFAULT_SENDER')
    if not mail_sender:
        current_app.logger.info('Mail Error: Sender not found.')
        return

    action_configs = (
        deposit.schema.config.get('notifications', {})
        .get('actions', {})
        .get(action, [])
    )

    # retrieve the most common Deposit/Record attributes, used in messages
    # try:
    msg_ctx = {
        'action': action,
        'base_url': current_app.config.get('CAP_MAIL_HOST_URL', ''),
        'base_api_url': current_app.config.get('CAP_MAIL_HOST_API_URL', ''),
        'submitter_id': user_id,
        'published_id': published_id(deposit),
        'draft_id': draft_id(deposit),
        'revision': revision(deposit),
        'working_url': working_url(deposit),
    }

    for config in action_configs:
        ctx_config = config.get("ctx", [])
        default_ctx = generate_ctx(ctx_config, record=deposit)
        _ctx = {**default_ctx, **msg_ctx}
        recipients, cc, bcc = generate_recipients(
            deposit, config, default_ctx=_ctx
        )
        if not any([recipients, cc, bcc]):
            continue

        try:
            subject = generate_subject(deposit, config, default_ctx=_ctx)
            body, base = generate_body(deposit, config, default_ctx=_ctx)
        except UnsuccessfulMail as err:
            current_app.logger.error(
                f"UnsuccessfulMail | Rec_id:{err.rec_uuid} - {err.msg}"
            )
            continue
        plain = config.get('body', {}).get('plain')

        mail_ctx = {
            'sender': mail_sender,
            'subject': subject,
            'recipients': recipients,
            'cc': cc,
            'bcc': bcc,
        }

        _ctx.update({'mail_body': body})

        create_and_send(base, _ctx, mail_ctx, plain=plain)
