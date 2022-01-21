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
"""Experiments CERN SSO utils."""

# Code reused from 'auth-get-sso-cookie' repo
# https://gitlab.cern.ch/authzsvc/tools/auth-get-sso-cookie

import logging
import requests
import time
from requests_kerberos import HTTPKerberosAuth, OPTIONAL
from bs4 import BeautifulSoup

try:
    from http.cookiejar import MozillaCookieJar, Cookie
except ImportError:  # python 2.7 compatibility
    from cookielib import MozillaCookieJar, Cookie


def save_cookies_lwp(cookiejar):
    """Return cookies from a requests.

    Session cookies member in the Netscape format.
    """

    lwp_cookiejar = MozillaCookieJar()
    for c in cookiejar:
        args = dict(vars(c).items())
        args["rest"] = args["_rest"]
        del args["_rest"]
        if args["expires"] is None:
            args["expires"] = int(time.time()) + 86400
        c = Cookie(**args)
        lwp_cookiejar.set_cookie(c)
    return lwp_cookiejar


def post_session_saml(session, response):
    """Performs the SAML POST.

    Performs the SAML POST request given a session and a
    successful Keycloak authentication response in SAML
    """

    soup_saml = BeautifulSoup(response.text, features="html.parser")
    action = soup_saml.form.get("action")
    post_key = soup_saml.form.input.get("name")
    post_value = soup_saml.form.input.get("value")
    session.post(action, data={post_key: post_value})


def login_with_kerberos(login_page, verify_cert, auth_hostname, silent):
    """Simulates a browser session to log in using SPNEGO protocol"""

    session = requests.Session()
    if not silent:
        logging.info("Fetching target URL and its redirects")
    r_login_page = session.get(login_page, verify=verify_cert)
    if not silent:
        logging.debug("Landing page: {}".format(r_login_page.url))
        logging.info("Parsing landing page to get the Kerberos login URL")
    soup = BeautifulSoup(r_login_page.text, features="html.parser")
    kerberos_button = soup.find(id="zocial-kerberos")
    if not kerberos_button:
        error_message = get_error_message(r_login_page.text)
        if error_message:
            raise Exception("Login failed: {}".format(error_message))
        else:
            raise Exception(
                "Login failed: Landing page not recognized.")
    kerberos_path = kerberos_button.get("href")
    if not silent:
        logging.info("Fetching Kerberos login URL")
    r_kerberos_redirect = session.get(
        "https://{}{}".format(auth_hostname, kerberos_path)
    )
    if not silent:
        logging.info("Logging in using Kerberos Auth")
    r_kerberos_auth = session.get(
        r_kerberos_redirect.url,
        auth=HTTPKerberosAuth(mutual_authentication=OPTIONAL),
        allow_redirects=False,
    )
    while (
        r_kerberos_auth.status_code == 302 and
        auth_hostname in r_kerberos_auth.headers["Location"]
    ):
        r_kerberos_auth = session.get(
            r_kerberos_auth.headers["Location"], allow_redirects=False
        )
    if r_kerberos_auth.status_code != 302:
        error_message = get_error_message(r_kerberos_auth.text)
        if not error_message:
            logging.debug(
                "Not automatically redirected: trying SAML authentication")
            post_session_saml(session, r_kerberos_auth)
        else:
            raise Exception("Login failed: {}".format(error_message))
    return session, r_kerberos_auth


def get_error_message(response_html):
    soup_err_page = BeautifulSoup(response_html, features="html.parser")
    error_message = soup_err_page.find(id="kc-error-message")
    if not error_message:
        return None
    else:
        return error_message.find("p").text


def save_sso_cookie(url, verify_cert, auth_hostname, silent=True):
    """Log in into a URL that redirects to the SSO.

    Log in into a URL that redirects to the SSO and
    save the session cookies
    """

    try:
        session, response = login_with_kerberos(
            url, verify_cert, auth_hostname, silent=silent)
        if response.status_code == 302:
            redirect_uri = response.headers["Location"]
            if not silent:
                logging.info(
                    "Logged in. Fetching redirect URL to get cookies")
            session.get(redirect_uri, verify=verify_cert)

        return save_cookies_lwp(session.cookies)

    except Exception as e:
        logging.error(
            "An error occurred while trying to log in and save cookies.")
        raise e
