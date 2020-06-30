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
from datetime import datetime

from celery import shared_task
from flask import current_app
from jinja2.exceptions import TemplateNotFound
from invenio_mail.api import TemplatedMessage

from cap.modules.mail.users import get_users_by_record


def send_mail_on_publish(depid, recid, url):
    subject = 'CERN Analysis Preservation: Published Analysis'
    recipients = get_users_by_record(depid, role='admin')

    # use this for testing, else we send mails to info@invenio
    # recipients = [current_app.config.get('MAIL_DEFAULT_SENDER')]

    create_and_send.delay('analysis_published.html',
                          dict(recid=recid, url=url),
                          subject,
                          recipients)


@shared_task(autoretry_for=(Exception,),
             retry_kwargs={
                 'max_retries': 3,
                 'countdown': 10
             })
def create_and_send(template, ctx, subject, recipients, sender=None):
    sender = sender or current_app.config['MAIL_DEFAULT_SENDER']

    try:
        assert recipients

        msg = TemplatedMessage(
            template_html=template,
            ctx=ctx,
            ** dict(sender=sender, bcc=recipients, subject=subject)
        )
        current_app.extensions['mail'].send(msg)

    except AssertionError:
        current_app.logger.error(
            f'Mail Error from {sender} with subject: {subject}.\n'
            f'Empty recipient list.')
        raise AssertionError

    except TemplateNotFound:
        raise TemplateNotFound

    except Exception as err:
        print(str(err))
