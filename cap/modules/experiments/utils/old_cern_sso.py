# Copyright (C) 2017, CERN
# This software is distributed under the terms of the GNU General Public
# Licence version 3 (GPL Version 3), copied verbatim in the file "LICENSE".
# In applying this license, CERN does not waive the privileges and immunities
# granted to it by virtue of its status as Intergovernmental Organization
# or submit itself to any jurisdiction.
# Original source: https://gitlab.cern.ch/db/cern-sso-python
#
# https://gitlab.cern.ch/authzsvc/tools/auth-get-sso-cookie/-/
# blob/master/auth_get_sso_cookie/old_cern_sso.py

from urllib.parse import urlparse, urljoin

import logging
import xml.etree.ElementTree as ET

import requests
from requests_gssapi import HTTPSPNEGOAuth, OPTIONAL

from logging import NullHandler


log = logging.getLogger(__name__)
log.addHandler(NullHandler())

DEFAULT_TIMEOUT_SECONDS = 10


def _init_session(s, url, cookiejar, auth_url_fragment):
    """
    Internal helper function: initialise the session.

    Internal helper function: initialise the session by trying to access
    a given URL, setting up cookies etc.

    :param: auth_url_fragment: a URL fragment which will be joined to
    the base URL after the redirect, before the parameters. Examples are
    auth/integrated/ (kerberos) and auth/sslclient/ (SSL)
    """
    if cookiejar is not None:
        log.debug("Using provided cookiejar")
        s.cookies = cookiejar

    # Try getting the URL we really want, and get redirected to SSO
    log.info("Fetching URL: %s" % url)
    r1 = s.get(url, timeout=DEFAULT_TIMEOUT_SECONDS)

    # Parse out the session keys from the GET arguments:
    redirect_url = urlparse(r1.url)
    log.debug("Was redirected to SSO URL: %s" % str(redirect_url))

    # ...and inject them into the Kerberos authentication URL
    final_auth_url = "{auth_url}?{parameters}".format(
        auth_url=urljoin(r1.url, auth_url_fragment),
        parameters=redirect_url.query)

    return final_auth_url


def _finalise_login(s, auth_results):
    """
    Perform the final POST authentication steps.

    Perform the final POST authentication steps to fully authenticate
    the session, saving any cookies in s' cookie jar.
    """
    r2 = auth_results

    # Did it work? Raise Exception otherwise.
    r2.raise_for_status()

    # Get the contents
    try:
        tree = ET.fromstring(r2.content)
    except ET.ParseError as e:
        log.error("Could not parse response from server!")
        log.error("The contents returned was:\n{}".format(r2.content))
        raise e

    action = tree.findall("body/form")[0].get('action')

    # Unpack the hidden form data fields
    form_data = dict((
        (elm.get('name'), elm.get('value'))
        for elm in tree.findall("body/form/input")))

    # ...and submit the form (WHY IS THIS STEP EVEN HERE!?)
    log.debug("Performing final authentication POST to %s" % action)
    r3 = s.post(url=action, data=form_data, timeout=DEFAULT_TIMEOUT_SECONDS)

    # Did _that_ work?
    r3.raise_for_status()

    # The session cookie jar should now contain the necessary cookies.
    log.debug("Cookie jar now contains: %s" % str(s.cookies))

    return s, r3


def krb_sign_on(url, cookiejar=None):
    """
    Perform Kerberos-backed single-sign on against a provided (protected) URL.

    It is assumed that the current session has a working Kerberos
    ticket.

    Returns a Requests session containing the cookie and the result
    of the authentication request.

    If a cookiejar-like object (such as a dictionary) is passed as the
    cookiejar keword argument, this is passed on to the Session.
    """
    kerberos_auth = HTTPSPNEGOAuth(mutual_authentication=OPTIONAL)

    with requests.Session() as s:

        krb_auth_url = _init_session(s=s, url=url, cookiejar=cookiejar,
                                     auth_url_fragment=u"auth/integrated/")

        # Perform actual Kerberos authentication
        log.info("Performing Kerberos authentication against %s"
                 % krb_auth_url)

        r2 = s.get(krb_auth_url, auth=kerberos_auth,
                   timeout=DEFAULT_TIMEOUT_SECONDS)

        return _finalise_login(s, auth_results=r2)
