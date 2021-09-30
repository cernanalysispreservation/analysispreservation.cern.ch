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

from .custom import body as custom_body
from .custom import recipients as custom_recipients
from .custom import subject as custom_subjects

from .conditions import CONDITION_METHODS
from .utils import (
    EMAIL_REGEX,
    get_config_default,
    populate_template_from_ctx,
    update_mail_list,
)


def check_condition(record, condition, default_ctx={}):
    """
    For each condition we have a group of checks to perform, which should
    return True/False

    Each condition has the following:
    - `checks`: the checks to be evaluated
    - `op`: the operation to be used for all the checks (and/or)
    - `mails`: the mail list

    Each check has their own attributes:
    - `condition`: the type of check (e.g. exists, is_in, etc)
    - `value`: the result
    - `path`: the path that gets the field to be evaluated

    An example of conditions:
    {
      "checks": [{
        "path": "parton_distribution_functions",
        "condition": "exists",
        "value": true
      }],
      "mails": {
        "default": ["pdf-forum-placeholder@cern.ch"]
      }
    }

    Nested checks are also allowed.
    """
    # for each condition we have a group of checks to perform
    # all of the checks should give a True/False result
    operator = condition.get("op", "and")
    checks = condition.get("checks", [])
    check_results = []

    for check in checks:
        # get the method to apply, and use it on the required path/value
        # for malformed conditions, we assume False
        if check.get("checks"):
            check_results.append(check_condition(record, check, default_ctx))
        elif check.get("condition"):
            try:
                method = CONDITION_METHODS[check["condition"]]
                path = check.get("path")
                value = check.get("value", True)
                check_results.append(
                    method(record, path, value, default_ctx=default_ctx)
                )
            except (KeyError, Exception):
                check_results.append(False)
        else:
            check_results.append(False)

    # due to all([]) == True, we make sure the list is not empty
    if check_results:
        # we check the validity of the condition depending on the operator:
        # - if 'and', then we need all the items to be true
        # - if 'or' we need at least 1 item to be true
        if operator == "and":
            return all(check_results)
        elif operator == "or":
            return any(check_results)
    return False


def get_recipients_from_config(record, config, default_ctx={}):
    """
    The `recipients` field differentiates 3 categories:
    - recipients
    - cc
    - bcc
    All 3 can be used to send a mail, and have their own mails and rules about
    how they will be added.

    The rules are in 3 categories:
    - `default`: the mails in the list will be added
    - `method`: a method that returns a list of mail (for complicated options)
    - `conditions`: mails will be added if a certain condition is true

    An example config of recipients:
    "recipients": {
      "bcc": [
        {
          "method": "get_owner"
        }, {
          "mails": {
            "default": ["some-recipient-placeholder@cern.ch"],
            "formatted": [{
              "template": "{% if cadi_id %}hn-cms-{{ cadi_id }}@cern.ch{% endif %}",  # noqa
              "ctx": [{
                "name": "cadi_id",
                "path": "analysis_context.cadi_id"
              }]
            }]
          }
        }, {
          "checks": {...}
        }
      ]
    }
    """
    if not config:
        return []

    mails = []
    for item in config:
        if isinstance(item, str):
            mails.append(item)
        elif isinstance(item, dict):
            if item.get("checks"):
                if not check_condition(record, item, default_ctx=default_ctx):
                    continue

            if item.get("method"):
                if isinstance(item.get("method"), list):
                    methods = item.get("method")
                else:
                    methods = [item.get("method")]

                for _method in methods:
                    try:
                        method = getattr(custom_recipients, _method)
                        result = method(record,
                                        config=item,
                                        default_ctx=default_ctx)
                        if isinstance(result, list):
                            mails += result
                        else:
                            mails += [result]
                    except AttributeError as exc:
                        current_app.logger.error(
                            f"Recipients function not found. Skipping.\n"
                            f"Error: {exc.args[0]}"
                        )

            if item.get("mails"):
                mail_config = item.get("mails", {})
                update_mail_list(record, mail_config,
                                 mails, default_ctx=default_ctx)
        else:
            continue

    # remove duplicates and possible empty values
    _mails = []
    for mail in set(mails):
        if isinstance(mail, str) and EMAIL_REGEX.match(mail):
            _mails.append(mail)

    return _mails


def generate_recipients(record, config, default_ctx={}):
    """
    Recipients generator for notification action.
    Using the `get_recipients_from_config` function, it retrieves and returns
    3 possible lists of mails: recipients, bcc, cc.
    """
    re_config = config.get("recipients")
    if not re_config:
        return [], [], []

    recipients = get_recipients_from_config(
        record, re_config.get("recipients"), default_ctx=default_ctx
    )
    cc = get_recipients_from_config(
        record, re_config.get("cc"), default_ctx=default_ctx
    )
    bcc = get_recipients_from_config(
        record, re_config.get("bcc"), default_ctx=default_ctx
    )

    return recipients, cc, bcc


def generate_body(record, config, default_ctx={}):
    """
    Body generator for notification action.
    It requires a template and a context (dict of vars-values), to populate it.
    If no template is found, the default one will be used.

    This function will retrieve the template and context for the body (message)
    as well as the base template and `plain` parameter.

    Example of message config:
    "body": {
      "body_template_file": "mail/message/questionnaire_message_published.html",
      "ctx": [{
        "name": "title",
        "path": "general_title"
      }, {
        "method": "submitter_email"
      }],
      "base_template_file": "mail/analysis_plain_text.html",
      "plain": false
    }

    In case of `method`, then the message will be retrieved from the result of
    the method. It's implementation should always be in the mail.custom.messages.py file  # noqa
    """
    body_config = config.get("body", {})

    # first get the body information
    # func = body_config.get('method')
    # if func:
    #     try:
    #         custom_message_func = getattr(custom_body, func)
    #         body = custom_message_func(record, config)
    #     except AttributeError as exc:
    #         current_app.logger.error(
    #             f'Body function not found. Providing default body.\n'
    #             f'Error: {exc.args[0]}')
    #         body = None
    # else:
    body = populate_template_from_ctx(record, body_config, module=custom_body,
                                      type="body", default_ctx=default_ctx)

    base = "mail/base_plain.html"

    if body_config.get("plain"):
        base = "mail/base_plain.html"

    if body_config.get("base_template"):
        base = body_config.get("base_template")
        # # then we get the template info if available
        # base = body_config.get('base_template', get_config_default(action, 'body'))  # noqa

    return body, base


def generate_subject(record, config, default_ctx={}):
    """
    Subject generator for notification action.
    It requires a template and a context (dict of vars-values), to populate it.
    If no template is found, the default one will be used.

    Example of subject config:
    "subject": {
      "template": "Subject with {{ title }} and id {{ published_id }}",
      "ctx": [{
        "name": "title",
        "path": "general_title"
      }, {
        "method": "published_id"
      }]
    }

    In case of `method`, then the subject will be retrieved from the result of
    the method. It's implementation should always be in the mail.custom.subjects.py file  # noqa
    """
    subj_config = config.get("subject")
    action = default_ctx.get("action", "")

    if not subj_config:
        return get_config_default(action, "subject")

    func = subj_config.get("method")
    if func:
        try:
            custom_subject_func = getattr(custom_subjects, func)
            subject = custom_subject_func(record, config)
            return subject
        except AttributeError as exc:
            current_app.logger.error(
                f"Subject function not found. Providing default subject.\n"
                f"Error: {exc.args[0]}"
            )
            return get_config_default(action, "subject")

    return populate_template_from_ctx(
        record,
        subj_config,
        module=custom_subjects,
        default_ctx=default_ctx,
        type="subject",
    )
