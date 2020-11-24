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
from flask_login import current_user

from .tasks import create_and_send


def path_value_equals(element, JSON):
    paths = element.split(".")
    data = JSON
    try:
        for i in range(0, len(paths)):
            data = data[paths[i]]
    except KeyError:
        return None

    return data


def get_cms_stat_recipients(record, config):
    data = current_app.config.get("CMS_STATS_COMMITEE_AND_PAGS")
    key = path_value_equals(config.get("path", ""), record)
    recipients = data.get(key, {}).get("contacts")
    params = data.get(key, {}).get("params", {})

    pdf_mail = current_app.config.get('PDF_FORUM_MAIL')
    if pdf_mail and record.get('parton_distribution_functions', None):
        recipients.append(pdf_mail)

    # mail for ML surveys
    conveners_ml_mail = current_app.config.get('CONVENERS_ML_MAIL')
    centralized_apps = record \
        .get('multivariate_discriminants', {}) \
        .get('use_of_centralized_cms_apps', {}) \
        .get('options', [])
    mva_use = record.get('multivariate_discriminants', {}).get('mva_use')

    if conveners_ml_mail and (
        (centralized_apps and 'No' not in centralized_apps) or mva_use == 'Yes'
    ):
        recipients.append(conveners_ml_mail)

    cadi_id = record.get('analysis_context', {}).get('cadi_id')

    message = ""
    if cadi_id:
        message += "A CMS Statistical Questionnaire has been published " + \
                    f"for analysis with CADI ID {cadi_id}. "
    message += \
        "The primary (secondary) contact for reviewing your questionnaire" + \
        f" is {params.get('primary', '-')} ({params.get('secondary', '-')}). "

    submitter_email = current_user.email
    recipients.append(submitter_email)
    message += f"Submitted by {submitter_email}"

    return message, recipients


GENERATE_RECIPIENT_METHODS = {
    "path_value_equals": path_value_equals,
    "get_cms_stat_recipients": get_cms_stat_recipients
}

NOTIFICATION_RECEPIENT = {
    "https://analysispreservation.cern.ch/schemas/deposits/"
    "records/cms-stats-questionnaire-v0.0.1.json": {
        "publish": {
            "type": "method",
            "method": "get_cms_stat_recipients",
            "path": "analysis_context.wg",
            "emailSubject": "CMS Statistics Committee - "
        }
    },
    "https://analysispreservation.cern.ch/schemas/deposits/"
    "records/cms-stats-questionnaire-v0.0.2.json": {
        "publish": {
            "type": "method",
            "method": "get_cms_stat_recipients",
            "path": "analysis_context.wg",
            "emailSubject": "CMS Statistics Committee - "
        }
    }
}


def generate_recipient_list(record, config):
    _type = config.get("type")
    if _type == "method":
        func = GENERATE_RECIPIENT_METHODS.get(config.get("method"))
        if func:
            return func(record, config)
    elif _type == "list":
        return config.get("message", ""), config.get("data")
    else:
        return "", None


def post_action_notifications(action=None, deposit=None, host_url=None):
    """Method to run after a deposit action .
    """
    recid, record = deposit.fetch_published()
    record_pid = recid.pid_value
    schema = deposit.get("$schema")

    recipients_config = NOTIFICATION_RECEPIENT.get(schema, {}).get(action)
    if recipients_config:
        message, recipients = generate_recipient_list(record,
                                                      recipients_config)

        if recipients:
            if action == "publish":
                send_mail_on_publish(
                    recipients,
                    record_pid,
                    host_url,
                    record.revision_id,
                    message,
                    subjectPrefix=recipients_config.get("emailSubject"))


def send_mail_on_publish(recipients,
                         recid,
                         url,
                         revision,
                         message,
                         subjectPrefix=''):
    if revision > 0:
        subject = subjectPrefix + \
            "New Version of Published Analysis | CERN Analysis Preservation"
        template = "mail/analysis_published_revision.html"
    else:
        subject = subjectPrefix + \
            "New Published Analysis | CERN Analysis Preservation"
        template = "mail/analysis_published_new.html"

    create_and_send.delay(template, dict(recid=recid, url=url,
                                         message=message), subject, recipients)
