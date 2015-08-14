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
# USA

from wtforms.validators import DataRequired
from wtforms import widgets
from invenio.base.i18n import _
from invenio.modules.deposit.form import WebDepositForm
from invenio.modules.deposit import fields
from invenio.modules.deposit.field_widgets import plupload_widget, \
    ExtendedListWidget, ColumnInput, ItemWidget
from invenio.modules.deposit.validation_utils import required_if

from .. import fields as data_fields

__all__ = ['AliceDataAnalysisForm']


def keywords_autocomplete(form, field, term, limit=50):
    return [{'value': "Keyword 1"}, {'value': "Keyword 2"}]

# Subforms


class CollectionsField(WebDepositForm):
    primary = data_fields.TextField(
        default='ALICE',
    )


class SoftwareForm(WebDepositForm):
    sw = data_fields.TextField(
        placeholder="ALIROOT",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-10"),
    )
    version = data_fields.TextField(
        placeholder="5_3_x",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-2"),
    )


class UserCodeForm(WebDepositForm):
    url = data_fields.TextField(
        placeholder="URL   E.g. git@github.com:johndoe/myrepo.git",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-7"),
    )
    tag = data_fields.TextField(
        placeholder="Tag",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-3 col-pad-0"),
    )
    harvest = fields.RadioField(
        default='link',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('harvest', _('Harvest')),
                 ('link', _('Link only'))],
    )


class OutputDataFilesForm(WebDepositForm):
    url = data_fields.TextField(
        label=_('Output Data Files'),
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8 col-pad-0"),
        placeholder="URL   E.g. root://eospublic.cern.ch//eos/lhcb/.../"
                    "myfile.root",
        export_key='url',
    )
    harvest = fields.RadioField(
        default='link',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('harvest', _('Harvest')),
                 ('link', _('Link only'))],
        export_key='harvest',
    )


class InternalDocsForm(WebDepositForm):
    doc = data_fields.TextField(
        placeholder="Please enter document url",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8 col-pad-0"),
    )
    harvest = fields.RadioField(
        default='link',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('harvest', _('Harvest')),
                 ('link', _('Link only'))],
    )


class InternalDiscussionForm(WebDepositForm):
    egroup = data_fields.TextField(
        placeholder='Please enter E-Group',
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-6"),
    )
    harvest = fields.RadioField(
        default='link',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('harvest', _('Harvest')),
                 ('link', _('Link only'))],
    )


class TalksForm(WebDepositForm):
    talk = data_fields.TextField(
        placeholder='Please enter Indico URL',
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8 col-pad-0"),
    )
    harvest = fields.RadioField(
        default='link',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('harvest', _('Harvest')),
                 ('link', _('Link only'))],
    )


class AliceDataAnalysisForm(WebDepositForm):

    """Deposition Form."""

    _name = 'alice'

    # Basic Info

    collections = fields.FormField(
        CollectionsField,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        export_key='collections',
        hidden=True,
    )

    analysisnum = data_fields.AnalysisNumberField(
        label=_('Analysis Number'),
        description='E.g. ALICE-ANA-2012-049',
        placeholder='Please enter Analysis Number',
        export_key='analysis_number',
        icon='fa fa-barcode fa-fw'
    )

    title = data_fields.TextField(
        label=_('Title'),
        icon='fa fa-book fa-fw',
        widget_classes='form-control',
        placeholder='Auto-completed via Analysis Number',
        export_key='data_title',
        validators=[DataRequired()]
    )

    authors = fields.DynamicFieldList(
        data_fields.TextField(
            placeholder="Auto-completed via Analysis Number",
            widget_classes='form-control field-list-element',
            widget=ColumnInput(class_="col-xs-10")
        ),
        label='Authors',
        validators=[DataRequired()],
        add_label='Add another author',
        icon='fa fa-user fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='data_authors',
    )

    abstract = fields.TextAreaField(
        label=_('Abstract'),
        widget_classes='form-control',
        placeholder='Auto-completed via Analysis Number',
        export_key='data_abstract',
        icon='fa fa-align-justify fa-fw'
    )

    accelerator = data_fields.TextField(
        label=_('Accelerator'),
        widget_classes='form-control',
        placeholder='Auto-completed via Analysis Number',
        description='E.g. CERN LHC',
        export_key='accelerator',
        icon='fa fa-forward fa-fw'
    )

    experiments = [("ALICE", _("ALICE")),
                   ("CMS", _("CMS")),
                   ("LHCb", _("LHCb"))]
    experiment = fields.SelectField(
        widget_classes='form-control',
        label=_('Experiment'),
        choices=experiments,
        export_key='experiment',
        default='ALICE',
        icon='fa fa-magnet fa-fw'
    )

    # Physics Info

    pridataset = fields.DynamicFieldList(
        data_fields.TextField(
            widget_classes='form-control',
            widget=ColumnInput(class_="col-xs-10"),
            placeholder="Please enter path to ESD Primary data set"
        ),
        label=_("ESD Primary Data Set Path"),
        icon='fa fa-road fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='esd_primary_data_set_path'
    )

    mcdataset = fields.DynamicFieldList(
        data_fields.TextField(
            widget_classes='form-control',
            widget=ColumnInput(class_="col-xs-10"),
            placeholder='Please enter path to MC Primary data set'
        ),
        label=_("MC Data Set Path"),
        icon='fa fa-road fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='mc_data_set_path'
    )

    keywords = fields.DynamicFieldList(
        data_fields.TextField(
            widget_classes='form-control',
            widget=ColumnInput(class_="col-xs-10"),
            placeholder='Optional keywords',
        ),
        label='Keywords',
        add_label='Add another keyword',
        icon='fa fa-tags fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='mc_keywords',
    )

    comments = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Comments"),
        export_key='mc_comments',
        icon='fa fa-align-justify fa-fw'
    )

    #  AOD Production Step

    os_options = [("SLC 5.x", _("SLC 5.x")),
                  ("SLC 6.x", _("SLC 6.x")),
                  ("Ubuntu", _("Ubuntu"))]
    aod_os = fields.SelectField(
        widget_classes='form-control',
        label=_('OS'),
        choices=os_options,
        export_key='aod_os',
        icon='fa fa-leaf fa-fw'
    )

    aod_software = fields.FormField(
        SoftwareForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label=_("Analysis Software"),
        export_key='aod_software',
        icon='fa fa-flag fa-fw'
    )

    aod_code = fields.FormField(
        UserCodeForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='User Code',
        widget_classes='',
        export_key='aod_user_code',
        icon='fa fa-link fa-fw'
    )

    aod_input_data_files = data_fields.InputDataFilesField(
        label=_('Input data files'),
        export_key='aod_input_data_files',
        icon='fa fa-arrow-right fa-fw'
    )

    aod_output_data_files = fields.DynamicFieldList(
        fields.FormField(
            OutputDataFilesForm,
            widget=ExtendedListWidget(
                item_widget=ItemWidget(),
                html_tag='div'
            ),
        ),
        label=_("Output Data Files"),
        widget_classes='',
        min_entries=1,
        export_key='aod_output_data_files',
        icon='fa fa-arrow-left fa-fw'
    )

    aod_reproduce = data_fields.ReproduceField(
        label='How to reproduce',
        widget_classes='form-control',
        export_key='aod_reproduce',
        icon='fa fa-repeat fa-fw'
    )

    aod_reproduce_upload = data_fields.FileUploadField(
        label='',
        hidden=True,
        disabled=False,
        widget=plupload_widget,
        export_key=False,
        validators=[
            required_if('aod_reproduce', ['other'])
        ],
    )

    aod_keywords = fields.DynamicFieldList(
        data_fields.TextField(
            widget_classes='form-control',
            widget=ColumnInput(class_="col-xs-10"),
            placeholder='Optional keywords',
        ),
        label='Keywords',
        add_label='Add another keyword',
        icon='fa fa-tags fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='aod_keywords',
    )

    aod_comments = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Comments"),
        export_key='aod_comments',
        icon='fa fa-align-justify fa-fw'
    )

    # Custom Analysis Step (mini-AOD)

    custom_os = fields.SelectField(
        widget_classes='form-control',
        label=_('OS'),
        choices=os_options,
        export_key='custom_os',
        icon='fa fa-leaf fa-fw'
    )

    custom_software = fields.FormField(
        SoftwareForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label=_("Analysis Software"),
        export_key='custom_software',
        icon='fa fa-flag fa-fw'
    )

    custom_code = fields.FormField(
        UserCodeForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='User Code',
        widget_classes='',
        export_key='custom_user_code',
        icon='fa fa-link fa-fw'
    )

    custom_input_data_files = data_fields.InputDataFilesField(
        label=_('Input data files'),
        export_key='custom_input_data_files',
        icon='fa fa-arrow-right fa-fw'
    )

    custom_output_data_files = fields.DynamicFieldList(
        fields.FormField(
            OutputDataFilesForm,
            widget=ExtendedListWidget(
                item_widget=ItemWidget(),
                html_tag='div'
            ),
        ),
        label='Output Data Files',
        widget_classes='',
        min_entries=1,
        export_key='custom_output_data_files',
        icon='fa fa-arrow-left fa-fw'
    )

    custom_reproduce = data_fields.ReproduceField(
        label='How to reproduce',
        widget_classes='form-control',
        export_key='custom_reproduce',
        icon='fa fa-repeat fa-fw'
    )

    custom_reproduce_upload = data_fields.FileUploadField(
        label='',
        hidden=True,
        disabled=False,
        widget=plupload_widget,
        export_key=False,
        validators=[
            required_if('custom_reproduce', ['other'])
        ],
    )

    custom_keywords = fields.DynamicFieldList(
        data_fields.TextField(
            widget_classes='form-control',
            widget=ColumnInput(class_="col-xs-10"),
            placeholder='Optional keywords',
        ),
        label='Keywords',
        add_label='Add another keyword',
        icon='fa fa-tags fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='custom_keywords'
    )

    custom_comments = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Comments"),
        export_key='custom_comments',
        icon='fa fa-align-justify fa-fw'
    )

    # End-user analysis

    end_os = fields.SelectField(
        widget_classes='form-control',
        label=_('OS'),
        choices=os_options,
        export_key='end_os',
        icon='fa fa-leaf fa-fw'
    )

    end_software = fields.FormField(
        SoftwareForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label=_("Analysis Software"),
        export_key='end_software',
        icon='fa fa-flag fa-fw'
    )

    end_code = fields.FormField(
        UserCodeForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='User Code',
        widget_classes='',
        export_key='end_user_code',
        icon='fa fa-link fa-fw'
    )

    end_input_data_files = data_fields.InputDataFilesField(
        label=_('Input data files'),
        export_key='end_input_data_files',
        icon='fa fa-arrow-right fa-fw'
    )

    end_output_data_files = fields.DynamicFieldList(
        fields.FormField(
            OutputDataFilesForm,
            widget=ExtendedListWidget(
                item_widget=ItemWidget(),
                html_tag='div'
            ),
        ),
        label='Output Data Files',
        widget_classes='',
        min_entries=1,
        export_key='end_output_data_files',
        icon='fa fa-arrow-left fa-fw'
    )

    end_reproduce = data_fields.ReproduceField(
        label='How to reproduce',
        widget_classes='form-control',
        export_key='end_reproduce',
        icon='fa fa-repeat fa-fw'
    )

    end_reproduce_upload = data_fields.FileUploadField(
        label='',
        hidden=True,
        disabled=False,
        widget=plupload_widget,
        export_key=False,
        validators=[
            required_if('end_reproduce', ['other'])
        ],
    )

    end_keywords = fields.DynamicFieldList(
        data_fields.TextField(
            widget_classes='form-control',
            widget=ColumnInput(class_="col-xs-10"),
            placeholder='Optional keywords',
        ),
        label='Keywords',
        add_label='Add another keyword',
        icon='fa fa-tags fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='end_keywords',
    )

    end_comments = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Comments"),
        export_key='end_comments',
        icon='fa fa-align-justify fa-fw'
    )

    # Internal Documentation

    internal_docs = fields.DynamicFieldList(
        fields.FormField(
            InternalDocsForm,
            widget=ExtendedListWidget(
                item_widget=ItemWidget(),
                html_tag='div'
            ),
        ),
        label='Internal Documentation',
        icon='fa fa-file fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='internal_docs'
    )

    internaldocs_keywords = fields.DynamicFieldList(
        data_fields.TextField(
            widget_classes='form-control',
            widget=ColumnInput(class_="col-xs-10"),
            placeholder='Optional keywords',
        ),
        label='Keywords',
        add_label='Add another keyword',
        icon='fa fa-tags fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='internal_docs_keywords',
    )

    internaldocs_comments = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Comments"),
        export_key='internal_docs_comments',
        icon='fa fa-align-justify fa-fw'
    )

    # Internal Discussion

    egroup = fields.DynamicFieldList(
        fields.FormField(
            InternalDiscussionForm,
            widget=ExtendedListWidget(
                item_widget=ItemWidget(),
                html_tag='div'
            ),
        ),
        label=_("E-Group"),
        icon='fa fa-user fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='egroup',
    )

    # Presented already ?

    internal_talks = fields.DynamicFieldList(
        fields.FormField(
            TalksForm,
            widget=ExtendedListWidget(
                item_widget=ItemWidget(),
                html_tag='div'
            ),
        ),
        label=_("Internal Talks"),
        icon='fa fa-user fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='internal_talks',
    )

    public_talks = fields.DynamicFieldList(
        fields.FormField(
            TalksForm,
            widget=ExtendedListWidget(
                item_widget=ItemWidget(),
                html_tag='div'
            ),
        ),
        label=_("Public Talks"),
        icon='fa fa-user fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='public_talks',
    )

    # Published already?

    journal_title = data_fields.TextField(
        label=_('Journal Title'),
        placeholder='Please enter the journal title',
        export_key='journal_title',
        widget_classes='form-control',
        icon='fa fa-book fa-fw'
    )

    journal_year = data_fields.TextField(
        label=_('Journal Year'),
        placeholder='Please enter the journal year',
        export_key='journal_year',
        widget_classes='form-control',
        icon='fa fa-calendar fa-fw'
    )

    journal_volume = data_fields.TextField(
        label=_('Journal Volume'),
        placeholder='Please enter the journal volume',
        export_key='journal_volume',
        widget_classes='form-control',
        icon='fa fa-tasks fa-fw'
    )

    journal_page = data_fields.TextField(
        label=_('Journal Page'),
        placeholder='Please enter the journal page number',
        export_key='journal_page',
        widget_classes='form-control',
        icon='fa fa-file fa-fw'
    )

    arXiv_id = data_fields.TextField(
        label=_("arXiv ID"),
        placeholder='arXiv:1413.9999',
        export_key='arxiv_id',
        widget_classes='form-control',
        icon='fa fa-bookmark fa-fw'
    )

    """ Form Configuration variables """
    _title = _('Submit an Analysis for ALICE')
    _subtitle = "Acess to all submitted data will be restricted to the "\
                "ALICE collaboration only."
    _drafting = True   # enable and disable drafting

    # Group fields in categories

    groups = [
        ('Basic Information',
            ['analysisnum', 'title', 'authors', 'abstract', 'accelerator',
                'experiment', 'collections'],
            {'description': "*** This whole section is autofilled by the \
                analysis number ***"}),
        ('Physics Information',
            ['pridataset', 'mcdataset', 'keywords', 'comments']),
        ('AOD Production Step',
            ['aod_os', 'aod_software', 'aod_code', 'aod_input_data_files',
                'aod_output_data_files', 'aod_reproduce',
                'aod_reproduce_upload', 'aod_keywords', 'aod_comments']),
        ('Custom Analysis Step (mini-AOD)',
            ['custom_os', 'custom_software', 'custom_code',
                'custom_input_data_files', 'custom_output_data_files',
                'custom_reproduce', 'custom_reproduce_upload',
                'custom_keywords', 'custom_comments']),
        ('End-user analysis',
            ['end_os', 'end_software', 'end_code', 'end_input_data_files',
                'end_output_data_files', 'end_reproduce',
                'end_reproduce_upload', 'end_keywords', 'end_comments']),
        ('Internal Documentation',
            ['internal_docs', 'internaldocs_keywords',
                'internaldocs_comments']),
        ('Internal Discussion',
            ['egroup']),
        ('Presented already?',
            ['internal_talks', 'public_talks']),
        ('Published already?',
            ['journal_title', 'journal_year', 'journal_volume',
                'journal_page', 'arXiv_id'])
    ]
