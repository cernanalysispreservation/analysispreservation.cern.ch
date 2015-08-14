# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2014, 2015 CERN.
#
# CERN Analysis Preservation Framework is free software; you can
# redistribute it and/or modify it under the terms of the GNU General
# Public License as published by the Free Software Foundation; either
# version 2 of the License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that
# it will be useful, but WITHOUT ANY WARRANTY; without even the
# implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
# PURPOSE.  See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this software; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307,
# USA.

from wtforms import TextField
from invenio.modules.deposit.field_base import WebDepositField
from invenio_records.api import Record
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

    try:
        if rec.get('primary_report_number') == field.data:
            # Authors
            if len(rec.get('authors')) > 0:
                form.authors.pop_entry()
                form.authors.pop_entry()
                for author in rec.get('authors'):
                    if author.get('full_name') not in form.authors.data:
                        form.authors.append_entry(author.get('full_name'))

            # Abstract
            if rec.get('abstract').get("summary"):
                form.abstract.data = rec.get("abstract").get("summary")

            # Title
            if rec.get('title').get('title'):
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

        # Hide autofilled fields for ALICE
        if form._name == 'alice':

            if rec.get('abstract').get('summary') is not None:
                form.abstract.flags.hidden = True
            if rec.get('title').get('title') is not None:
                form.title.flags.hidden = True
            if rec.get('authors') is not None:
                form.authors.flags.hidden = True
            if rec.get(
                    'accelerator_experiment').get('accelerator') is not None:
                form.accelerator.flags.hidden = True
            if rec.get("accelerator_experiment").get('experiment') is not None:
                form.experiment.flags.hidden = True

    except AttributeError:
        if form._name == 'alice':
            # Unhide fields
            form.abstract.flags.hidden = False
            form.title.flags.hidden = False
            form.authors.flags.hidden = False
            form.accelerator.flags.hidden = False
            form.experiment.flags.hidden = False

        else:
            pass


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
