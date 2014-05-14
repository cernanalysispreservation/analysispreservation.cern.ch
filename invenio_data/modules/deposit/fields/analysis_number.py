# -*- coding: utf-8 -*-
##
## This file is part of Invenio.
## Copyright (C) 2013, 2014 CERN.
##
## Invenio is free software; you can redistribute it and/or
## modify it under the terms of the GNU General Public License as
## published by the Free Software Foundation; either version 2 of the
## License, or (at your option) any later version.
##
## Invenio is distributed in the hope that it will be useful, but
## WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
## General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with Invenio; if not, write to the Free Software Foundation, Inc.,
## 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.

from wtforms import TextField
from invenio.modules.deposit.field_base import WebDepositField
from invenio.modules.records.api import Record
from requests import get

__all__ = ['AnalysisNumberField']


def get_xml_and_jsonify(rep_no):
    """
    Retreives XML data from CDS and returns jsonified temp record
    :param rep_no: The report number to be retreived
    :type rep_no: String
    :returns: dict

    Workflow - Download an XML file from CDS using a link like:
    http://cds.cern.ch/search?p=reportnumber%3A"CERN-THESIS-2013-297"&of=xm
    JSONify the xml and return it.
    """
    xml = get("""http://cds.cern.ch/search?p=reportnumber%%3A"%s"&of=xm"""
              % rep_no).content
    if xml[83] == '1' and xml[84] == ' ':
        return Record.create(xml, 'marc', model='data_analysis_cds_extract')
    return None


def autofill(form, field, submit=False, fields=None):
    """
    Uses Jsonififed record to autofill authors
    """

    rec = get_xml_and_jsonify(field.data)

    if rec.get('primary_report_number') == field.data:
        # Authors
        # FIXME: Requires a refresh to display the added authors
        # if len(rec.get('authors')) > 0:
        #     for author in rec.get('authors'):
        #         form.authors.append_entry(author.get('full_name'))

        # Abstract
        if rec.get('abstract'):
            form.abstract.data = rec.get("abstract").get("summary")

        # Title
        if rec.get('title'):
            form.title.data = rec.get("title").get('title')

        # Accelerator;Experiment
        if rec.get('accelerator_experiment'):
            # Accelerator
            if rec.get('accelerator_experiment').get('accelerator'):
                form.accelerator.data = \
                    rec.get('accelerator_experiment').get('accelerator')

            # Experiment
            if rec.get('accelerator_experiment').get('experiment'):
                form.experiment.data = \
                    rec.get("accelerator_experiment").get('experiment')

        # if form.__class__.__name__ == "AliceDataAnalysisForm":
        #     if rec.get('title') is not None:
        #         form.abstract.flags.hidden = True
        #         form.title.flags.hidden = True
        #         # form.authors.flags.hidden = True
        #         form.accelerator.flags.hidden = True
        #         form.experiment.flags.hidden = True
        #     else:
        #         form.abstract.flags.hidden = False
        #         form.title.flags.hidden = False
        #         # form.authors.flags.hidden = False
        #         form.accelerator.flags.hidden = False
        #         form.experiment.flags.hidden = False

class AnalysisNumberField(WebDepositField, TextField):
    def __init__(self, **kwargs):
        defaults = dict(
            icon='barcode',
            export_key='analysisNumber',
            widget_classes="form-control",
            processors=[autofill]
        )
        defaults.update(kwargs)
        super(AnalysisNumberField, self).__init__(**defaults)
