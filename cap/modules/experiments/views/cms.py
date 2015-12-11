"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, jsonify, render_template, request, g
from flask_login import login_required
from invenio_records.models import RecordMetadata
from cap.modules.front.views import collection_records
from ..scripts.cms import das
import json
import urllib
import urllib2
import ssl


cms_bp = Blueprint(
    'cap_cms',
    __name__,
    url_prefix='/CMS',
    template_folder='../templates',
    static_folder='../static',
)


ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


@cms_bp.before_request
@login_required
def restrict_bp_to_cms_members():
    g.experiment = 'CMS'
    print('Checking to see if user is a CMS member')


@cms_bp.route('/')
def cms_landing():
    """Basic CMS landing view."""
    return render_template('cms/landing_page.html')


@cms_bp.route('/records')
def cms_records():
    """Basic CMS records view."""
    return collection_records(collection=g.experiment)


@cms_bp.route('/das', methods=['GET'])
def das_client():
    host = request.args.get('host', 'https://cmsweb.cern.ch')
    query = request.args.get('query', '')
    idx = request.args.get('idx', 0)
    limit = request.args.get('limit', 10)
    debug = request.args.get('debug', 0)

    jsondict = das.get_data(
        query=query, host=host, idx=idx, limit=limit, debug=debug)
        #query=query, host="https://cmsweb.cern.ch", idx=0, limit=10, debug=0)

    newdict = {}
    if (jsondict["nresults"] == 1):
        print(json.dumps(jsondict, indent=4))

        for v in jsondict["data"][0]["dataset"]:
            newdict = dict(newdict.items() + v.items())
        return jsonify(**newdict)
    else:
        return jsonify(**newdict)


@cms_bp.route('/das/autocomplete', methods=['GET'])
def das_autocomplete():
    dbs_instance = request.args.get('dbs_instance', 'prod/global')
    query = request.args.get('query', None)

    url = 'https://cmsweb.cern.ch/das/autocomplete'
    params = {'dbs_instance': dbs_instance, 'query': query}
    encoded_data = urllib.urlencode(params, doseq=True)
    url += '?%s' % encoded_data
    response = urllib2.urlopen(url, context=ctx)
    return response.read()
