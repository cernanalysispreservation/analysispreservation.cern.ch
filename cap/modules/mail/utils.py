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

from cap.modules.mail.users import get_users_by_record


def send_mail_published(depid, recid, url, sender=None, recipients=None):
    subject = 'CERN Analysis Preservation: Published Analysis'

    if not sender:
        sender = current_app.config.get('MAIL_USERNAME') or \
                 current_app.config['SUPPORT_EMAIL']

    if not recipients:
        recipients = get_users_by_record(depid, role='admin')
        # recipients = [current_app.config.get('MAIL_USERNAME')]

    create_and_send('analysis_published.html',
                    dict(recid=recid, url=url),
                    dict(subject=subject,
                         sender=sender,
                         recipients=recipients)
                    )


@shared_task
def create_and_send(template, ctx, mail_args):
    msg = TemplatedMessage(template_html=template, ctx=ctx, **mail_args)
    try:
        current_app.extensions['mail'].send(msg)
    except Exception as err:
        print(str(err))
