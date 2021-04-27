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

from celery import shared_task
from flask import current_app
from invenio_mail.api import TemplatedMessage


@shared_task(autoretry_for=(Exception, ),
             retry_kwargs={
                 'max_retries': 3,
                 'countdown': 10
             })
def create_and_send(template, ctx, subject, recipients,
                    sender=None, type=None):
    if not current_app.config['CAP_SEND_MAIL']:
        return

    sender = sender or current_app.config.get('MAIL_DEFAULT_SENDER')
    try:
        assert recipients

        if type == "plain":
            msg = TemplatedMessage(template_body=template,
                                   ctx=ctx,
                                   **dict(sender=sender,
                                          recipients=recipients,
                                          subject=subject))
        else:
            msg = TemplatedMessage(template_html=template,
                                   ctx=ctx,
                                   **dict(sender=sender,
                                          recipients=recipients,
                                          subject=subject))
        current_app.extensions['mail'].send(msg)

    except AssertionError:
        current_app.logger.error(
            f'Mail Error from {sender} with subject: {subject}.\n'
            f'Empty recipient list.')
        raise AssertionError
