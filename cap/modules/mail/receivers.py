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
from flask import request

from .utils import NOTIFICATION_RECEPIENT, generate_notification_attrs, \
    send_mail_on_review, send_mail_on_publish, create_analysis_url


def post_action_notifications(sender, action=None, pid=None, deposit=None):
    """Method to run after a deposit action ."""
    schema = deposit.get("$schema")
    recipients_config = NOTIFICATION_RECEPIENT.get(schema, {}).get(action)
    host_url = request.host_url

    if recipients_config:
        subject, message, recipients = generate_notification_attrs(
            deposit, host_url, recipients_config)

        if recipients:
            if action == "publish":
                recid, record = deposit.fetch_published()

                send_mail_on_publish(
                    recid.pid_value,
                    record.revision_id,
                    host_url,
                    recipients,
                    message,
                    subject_prefix=subject)

            if action == "review":
                analysis_url = create_analysis_url(deposit)

                send_mail_on_review(
                    analysis_url,
                    host_url,
                    recipients,
                    message,
                    subject_prefix=subject)
