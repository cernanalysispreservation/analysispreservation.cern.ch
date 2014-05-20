# -*- coding: utf-8 -*-
##
## This file is part of Invenio.
## Copyright (C) 2014 CERN.
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
## 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA

from wtforms.validators import Required
from wtforms import widgets
from invenio.base.i18n import _
from invenio.modules.deposit.form import WebDepositForm
from invenio.modules.deposit import fields
from invenio.modules.deposit.field_widgets import plupload_widget, \
    ExtendedListWidget, ColumnInput, ItemWidget
from invenio.modules.deposit.validation_utils import required_if

from .. import fields as data_fields

__all__ = ('CMSDataAnalysisForm', )


def keywords_autocomplete(form, field, term, limit=50):
    return [{'value': "Keyword 1"}, {'value': "Keyword 2"}]

# Subforms


class SoftwareForm(WebDepositForm):
    sw = data_fields.TextField(
        placeholder="CMSSW",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8"),
    )
    version = data_fields.TextField(
        placeholder="5_3_x",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-4 col-pad-0"),
    )


class UserCodeForm(WebDepositForm):
    url = data_fields.TextField(
        placeholder="URL   E.g. git@github.com:johndoe/myrepo.git",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-7"),
    )
    tag = data_fields.TextField(
        placeholder="Tag    E.g. v2.1",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-3 col-pad-0"),
    )
    harvest = fields.RadioField(
        default='no',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('yes', _('Harvest')),
                 ('no', _('Link only'))]
    )


class OutputDataFilesForm(WebDepositForm):
    output_data_files = data_fields.TextField(
        label=_('Output Data Files'),
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8 col-pad-0"),
        placeholder="URL  E.g. root://eospublic.cern.ch//eos/lhcb/.../"
                    "myfile.root"
    )
    harvest = fields.RadioField(
        default='no',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('yes', _('Harvest')),
                 ('no', _('Link only'))],
    )


class InternalDocsForm(WebDepositForm):
    docs = data_fields.TextField(
        placeholder="Please enter document url",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8 col-pad-0"),
    )
    harvest = fields.RadioField(
        default='no',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('yes', _('Harvest')),
                 ('no', _('Link only'))],
    )


class InternalDiscussionForm(WebDepositForm):
    discussion = data_fields.TextField(
        placeholder='Please enter E-Group',
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8 col-pad-0"),
    )
    harvest = fields.RadioField(
        default='no',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('yes', _('Harvest')),
                 ('no', _('Link only'))],
    )


class TalksForm(WebDepositForm):
    discussion = data_fields.TextField(
        placeholder='Please enter Indicio URL',
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8 col-pad-0"),
    )
    harvest = fields.RadioField(
        default='no',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('yes', _('Harvest')),
                 ('no', _('Link only'))],
    )

# Deposition Form


class CMSDataAnalysisForm(WebDepositForm):

    """Deposition Form"""

    # Basic Info

    analysisnum = data_fields.AnalysisNumberField(
        label=_('Analysis Number'),
        description='E.g. CMS-ANA-2012-049',
        placeholder='Please enter Analysis Number',
        export_key='cms.analysisnumber',
        icon='fa fa-barcode fa-fw',
        validators=[Required()]
    )

    title = data_fields.TextField(
        label=_('Title'),
        widget_classes='form-control',
        placeholder='Auto-completed via Analysis Number',
        export_key='cms.title',
        icon='fa fa-book fa-fw',
        hidden=True
    )

    authors = fields.DynamicFieldList(
        data_fields.TextField(
            placeholder="Auto-completed via Analysis Number",
            widget_classes='form-control',
            widget=ColumnInput(class_="col-xs-10"),
        ),
        label='Authors',
        add_label='Add another author',
        icon='fa fa-user fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='cms.authors',
        hidden=True
    )

    abstract = fields.TextAreaField(
        label=_('Abstract'),
        placeholder='Auto-completed via Analysis Number',
        export_key='cms.abstract',
        widget_classes='form-control',
        icon='fa fa-align-justify fa-fw',
        hidden=True
    )

    accelerator = data_fields.TextField(
        label=_('Accelerator'),
        placeholder='CERN LHC',
        export_key='cms.accelerator',
        icon='fa fa-forward fa-fw',
        widget_classes='form-control',
        hidden=True
    )

    experiments = [("CMS", _("CMS")),
                   ("ALICE", _("ALICE")),
                   ("LHCb", _("LHCb"))]
    experiment = fields.SelectField(
        label=_('Experiment'),
        choices=experiments,
        export_key='cms.experiment',
        icon='fa fa-magnet fa-fw',
        default='CMS',
        widget_classes='form-control',
        hidden=True
    )

    # Physics Info

    pridataset = fields.DynamicFieldList(
        data_fields.TextField(
            widget_classes='form-control',
            widget=ColumnInput(class_="col-xs-10"),
            placeholder=_("Please enter path to primary data set"),
        ),
        label=_("Primary Data Set"),
        icon='fa fa-road fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='cms.esdprimarydataset'
    )

    mcdataset = fields.DynamicFieldList(
        data_fields.TextField(
            widget_classes='form-control',
            widget=ColumnInput(class_="col-xs-10"),
            placeholder=_("Please enter path to MC data set"),
        ),
        label=_("MC Data Set Path"),
        icon='fa fa-road fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='cms.mcdatasetpath'
    )

    triggerselection = fields.DynamicFieldList(
        data_fields.TextField(
            widget_classes='form-control',
            label='Trigger Selection',
            widget=ColumnInput(class_="col-xs-10"),
            placeholder=_("???"),
        ),
        label='Trigger Selection',
        add_label='Add another trigger',
        icon='fa fa-certificate fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='cms.triggerselection',
    )

    physics_objects = data_fields.TextField(
        widget_classes='form-control',
        label=_("Physics Objects"),
        placeholder='Standard physics objects?',
        export_key='cms.physicsobjects',
        icon='fa fa-filter fa-fw'
    )

    callibration = data_fields.TextField(
        widget_classes='form-control',
        label=_("Callibration"),
        placeholder='If not, what callibration?',
        export_key='cms.callibration',
        icon='fa fa-wrench fa-fw'
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
        export_key='cms.keywords',
    )

    comments = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Comments"),
        export_key='cms.comments',
        icon='fa fa-align-justify fa-fw'
    )

    #  Pre Selection Step

    os_options = [("slc5", _("SLC 5.x")),
                  ("slc6", _("SLC 6.x")),
                  ("ubuntu", _("Ubuntu"))]
    pre_os = fields.SelectField(
        widget_classes='form-control',
        label=_('OS'),
        choices=os_options,
        export_key='cms.pre_os',
        icon='fa fa-leaf fa-fw'
    )

    pre_software = fields.FormField(
        SoftwareForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='Analysis Software',
        icon='fa fa-flag fa-fw',
        widget_classes='',
        export_key='cms.pre_software'
    )

    pre_code = fields.FormField(
        UserCodeForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='User Code',
        widget_classes='',
        export_key='cms.pre_usercode',
        icon='fa fa-link fa-fw'
    )

    pre_input_data_files = data_fields.InputDataFilesField(
        label=_('Input data files'),
        export_key='cms.pre_indatafiles',
        icon='fa fa-arrow-right fa-fw'
    )

    pre_output_data_files = fields.DynamicFieldList(
        fields.FormField(
            OutputDataFilesForm,
            widget=ExtendedListWidget(
                item_widget=ItemWidget(),
                html_tag='div'
            ),
        ),
        label='Output Data Files',
        icon='fa fa-arrow-left fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='cms.pre_outdatafiles',
    )

    pre_reproduce = data_fields.ReproduceField(
        label='How to reproduce',
        icon='fa fa-repeat fa-fw',
        widget_classes='form-control',
        export_key='cms.pre_reproduce',
    )

    pre_reproduce_upload = data_fields.FileUploadField(
        label='',
        hidden=True,
        disabled=True,
        widget=plupload_widget,
        export_key=False,
        validators=[
            required_if('pre_reproduce', ['other'])
        ],
    )

    pre_keywords = fields.DynamicFieldList(
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
        export_key='cms.pre_keywords',
    )

    pre_comments = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Comments"),
        export_key='cms.pre_comments',
        icon='fa fa-align-justify fa-fw'
    )

    # Custom Analysis Step (mini-AOD)

    custom_os = fields.SelectField(
        widget_classes='form-control',
        label=_('OS'),
        choices=os_options,
        export_key='cms.custom_os_option',
        icon='fa fa-leaf fa-fw'
    )

    custom_software = fields.FormField(
        SoftwareForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='Analysis Software',
        icon='fa fa-flag fa-fw',
        widget_classes='',
        export_key='cms.custom_software',
    )

    custom_code = fields.FormField(
        UserCodeForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='User Code',
        icon='fa fa-link fa-fw',
        widget_classes='',
        export_key='cms.custom_usercode',
    )

    custom_input_data_files = data_fields.InputDataFilesField(
        label=_('Input data files'),
        export_key='cms.custom_indputdatafiles',
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
        icon='fa fa-arrow-left fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='cms.custom_outdatafiles',
    )

    custom_reproduce = data_fields.ReproduceField(
        label='How to reproduce',
        icon='fa fa-repeat fa-fw',
        widget_classes='form-control',
        export_key='cms.custom_reproduce',
    )

    custom_reproduce_upload = data_fields.FileUploadField(
        label='',
        hidden=True,
        disabled=True,
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
        export_key='cms.custom_keywords',
    )

    custom_comments = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Comments"),
        export_key='cms.custom_comments',
        icon='fa fa-align-justify fa-fw'
    )

    # End-user analysis

    enduser_os = fields.SelectField(
        widget_classes='form-control',
        label=_('OS'),
        choices=os_options,
        export_key='cms.enduser_os_option',
        icon='fa fa-leaf fa-fw'
    )

    enduser_software = fields.FormField(
        SoftwareForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='Analysis Software',
        icon='fa fa-flag fa-fw',
        widget_classes='',
        export_key='cms.enduser_software',
    )

    enduser_code = fields.FormField(
        UserCodeForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='User Code',
        icon='fa fa-link fa-fw',
        widget_classes='',
        export_key='cms.enduser_usercode'
    )

    enduser_input_data_files = data_fields.InputDataFilesField(
        label=_('Input data files'),
        export_key='cms.enduser_inputdatafiles',
        icon='fa fa-arrow-right fa-fw'
    )

    enduser_output_data_files = fields.DynamicFieldList(
        fields.FormField(
            OutputDataFilesForm,
            widget=ExtendedListWidget(
                item_widget=ItemWidget(),
                html_tag='div'
            ),
        ),
        label='Output Data Files',
        icon='fa fa-arrow-left fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='cms.enduser_outdatafiles',
    )

    enduser_reproduce = data_fields.ReproduceField(
        label='How to reproduce',
        icon='fa fa-repeat fa-fw',
        widget_classes='form-control',
        export_key='cms.enduser_reproduce',
    )

    enduser_reproduce_upload = data_fields.FileUploadField(
        label='',
        hidden=True,
        disabled=True,
        widget=plupload_widget,
        export_key=False,
        validators=[
            required_if('enduser_reproduce', ['other'])
        ],
    )

    enduser_keywords = fields.DynamicFieldList(
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
        export_key='cms.enduser_keywords',
    )

    enduser_comments = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Comments"),
        export_key='cms.enduser_comments',
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
        export_key='cms.internaldocs',
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
        export_key='cms.internaldocs_keywords',
    )

    internaldocs_comments = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Comments"),
        export_key='cms.internaldocs_comments',
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
        add_label=_("Add another E-Group"),
        icon='fa fa-user fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='cms.internaldiscussion',
    )

    # Presented already ?

    public_talks = fields.DynamicFieldList(
        fields.FormField(
            TalksForm,
            widget=ExtendedListWidget(
                item_widget=ItemWidget(),
                html_tag='div'
            ),
        ),
        label=_("Indico Talks"),
        icon='fa fa-user fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='cms.publictalks',
    )

    # Published already?

    journal_title = data_fields.TextField(
        label=_('Journal Title'),
        placeholder='Please enter the journal title',
        export_key='cms.journaltitle',
        widget_classes='form-control',
        icon='fa fa-book fa-fw'
    )

    journal_year = data_fields.TextField(
        label=_('Journal Year'),
        placeholder='Please enter the journal year',
        export_key='cms.journalyear',
        widget_classes='form-control',
        icon='fa fa-calendar fa-fw'
    )

    journal_volume = data_fields.TextField(
        label=_('Journal Volume'),
        placeholder='Please enter the journal volume',
        export_key='cms.journalvolume',
        widget_classes='form-control',
        icon='fa fa-tasks fa-fw'
    )

    journal_page = data_fields.TextField(
        label=_('Journal Page'),
        placeholder='Please enter the journal page number',
        export_key='cms.journalpage',
        widget_classes='form-control',
        icon='fa fa-file fa-fw'
    )

    arXiv_id = data_fields.TextField(
        label=_("arXiv ID"),
        placeholder='arXiv:1413.9999',
        export_key='cms.arxivid',
        widget_classes='form-control',
        icon='fa fa-bookmark fa-fw'
    )

    """ Form Configuration variables """
    _title = _('Submit an Analysis for CMS')
    _subtitle = "Acess to all submitted data will be restricted to the "\
                "CMS collaboration only."
    _drafting = True   # enable and disable drafting

    # Group fields in categories

    groups = [
        ('Basic Information',
            ['analysisnum', 'title', 'authors', 'abstract', 'accelerator',
                'experiment']),
        ('Physics Information',
            ['pridataset', 'mcdataset', 'triggerselection', 'physics_objects',
                'callibration', 'keywords', 'comments']),
        ('Pre-selection Step',
            ['pre_os', 'pre_software', 'pre_code', 'pre_input_data_files',
                'pre_output_data_files', 'pre_reproduce',
                'pre_reproduce_upload', 'pre_keywords', 'pre_comments']),
        ('Custom Analysis Step?',
            ['custom_os', 'custom_software', 'custom_code',
                'custom_input_data_files', 'custom_output_data_files',
                'custom_reproduce', 'custom_reproduce_upload',
                'custom_keywords', 'custom_comments']),
        ('Final Selection Step',
            ['enduser_os', 'enduser_software', 'enduser_code',
                'enduser_input_data_files', 'enduser_output_data_files',
                'enduser_reproduce', 'enduser_reproduce_upload',
                'enduser_keywords', 'enduser_comments']),
        ('Internal Documentation',
            ['internal_docs', 'internaldocs_keywords',
                'internaldocs_comments']),
        ('Internal Discussion',
            ['egroup']),
        ('Presented already?',
            ['public_talks']),
        ('Published already?',
            ['journal_title', 'journal_year', 'journal_volume',
                'journal_page', 'arXiv_id'])
    ]
