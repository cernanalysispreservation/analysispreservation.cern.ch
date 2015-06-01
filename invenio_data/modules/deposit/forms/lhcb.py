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

__all__ = ['LHCbDataAnalysisForm']


def keywords_autocomplete(form, field, term, limit=50):
    return [{'value': "Keyword 1"}, {'value': "Keyword 2"}]

# Subforms


class CollectionsField(WebDepositForm):
    primary = data_fields.TextField(
        default='LHCb',
    )


class ReconstructionSWForm(WebDepositForm):
    sw = data_fields.TextField(
        placeholder="Brunel",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8"),
        export_key='sw'
    )
    version = data_fields.TextField(
        placeholder="Reco13",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-4 col-pad-0"),
        export_key='version'
    )


class StrippingSWForm(WebDepositForm):
    sw = data_fields.TextField(
        placeholder="DaVinciStripping",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8"),
        export_key='sw'
    )
    version = data_fields.TextField(
        placeholder="17",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-4 col-pad-0"),
        export_key='version'
    )


class AnalysisSWForm(WebDepositForm):
    sw = data_fields.TextField(
        placeholder="DaVinci",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8"),
        export_key='sw'
    )
    version = data_fields.TextField(
        placeholder="Version",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-4 col-pad-0"),
        export_key='version'
    )


class UserCodeForm(WebDepositForm):
    url = data_fields.TextField(
        placeholder="URL   E.g. svn@svnweb.cern.ch/cern/wsvn/myrepo",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-7"),
        export_key='url'
    )
    tag = data_fields.TextField(
        placeholder="Tag    E.g. v2.1",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-3 col-pad-0"),
        export_key='tag'
    )
    harvest = fields.RadioField(
        default='link',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('harvest', _('Harvest')),
                 ('link', _('Link only'))],
        export_key='harvest'
    )


class FinalNTuplesForm(WebDepositForm):
    data_file = data_fields.TextField(
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-10 col-pad-0"),
        placeholder="URL   E.g. root://eospublic.cern.ch//eos/"
                    "lhcb/.../myfile.root",
        export_key='data_file'
    )

    data_files_harvest = fields.RadioField(
        default='link',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('harvest', _('Harvest')),
                 ('link', _('Link only'))],
        export_key='harvest'
    )

    description = data_fields.TextField(
        description='E.g. data, MC...',
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-10 col-pad-0"),
        export_key='description',
        icon='fa fa-align-justify fa-fw',
        placeholder='Description'
    )


class InternalDocsForm(WebDepositForm):
    doc = data_fields.TextField(
        placeholder="Please enter document url",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8 col-pad-0"),
        export_key='doc',
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


class InternalDiscussionForm(WebDepositForm):
    egroup = data_fields.TextField(
        placeholder='Please enter E-Group',
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8 col-pad-0"),
        export_key='egroup'
    )
    harvest = fields.RadioField(
        default='link',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('harvest', _('Harvest')),
                 ('link', _('Link only'))],
        export_key='harvest'
    )


class TalksForm(WebDepositForm):
    talk = data_fields.TextField(
        placeholder='Please enter Indico URL',
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8 col-pad-0"),
        export_key='talk'
    )
    harvest = fields.RadioField(
        default='link',
        widget_classes='form-group list-unstyled',
        widget=ColumnInput(class_="col-xs-2 col-pad-0",
                           widget=widgets.ListWidget(prefix_label=False)),
        choices=[('harvest', _('Harvest')),
                 ('link', _('Link only'))],
        export_key='harvest'
    )

# Deposition Form


class LHCbDataAnalysisForm(WebDepositForm):

    """Deposition Form"""

    _name = 'lhcb'

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

    analysisname = data_fields.TextField(
        widget_classes='form-control',
        label=_('Analysis Name'),
        description='E.g. Bs2JpsiKS',
        placeholder='Please enter Analysis Name',
        export_key='analysis_name',
        icon='fa fa-credit-card fa-fw',
        validators=[DataRequired()]
    )

    analysisnum = data_fields.AnalysisNumberField(
        label=_('Analysis Number'),
        description='E.g. LHCb-ANA-2012-049',
        placeholder='Please enter Analysis Number',
        export_key='analysis_number',
        icon='fa fa-barcode fa-fw',
        validators=[DataRequired()]
    )

    title = data_fields.TextField(
        label=_('Title'),
        placeholder='Auto-completed via Analysis Number',
        export_key='data_title',
        widget_classes='form-control',
        icon='fa fa-book fa-fw',
        hidden=True,
    )

    authors = fields.DynamicFieldList(
        data_fields.TextField(
            placeholder="Auto-completed via Analysis Number",
            widget_classes='form-control field-list-element',
            widget=ColumnInput(class_="col-xs-10"),
        ),
        label='Authors',
        add_label='Add another author',
        icon='fa fa-user fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='data_authors',
        hidden=True,
    )

    abstract = data_fields.TextField(
        label=_('Abstract'),
        placeholder='Auto-completed via Analysis Number',
        export_key='data_abstract',
        widget_classes='form-control',
        icon='fa fa-align-justify fa-fw',
        hidden=True,
    )

    accelerator = data_fields.TextField(
        label=_('Accelerator'),
        placeholder='CERN LHC',
        export_key='accelerator',
        icon='fa fa-forward fa-fw',
        widget_classes='form-control',
        hidden=True,
    )

    experiments = [("LHCb", _("LHCb")),
                   ("ALICE", _("ALICE")),
                   ("CMS", _("CMS"))]
    experiment = fields.SelectField(
        label=_('Experiment'),
        choices=experiments,
        export_key='experiment',
        icon='fa fa-magnet fa-fw',
        default='LHCb',
        widget_classes='form-control',
        hidden=True,
    )

    # Event Samples - Data

    dst_bk_path = data_fields.TextField(
        widget_classes='form-control',
        label=_("DST BK Path"),
        description="e.g: sim://LHCb/Collision12/Beam4000GeV-VeloClosed-MagDo\
        wn/RealData/Reco14/Stripping20/90000000 ( Full stream )/BHADR",
        export_key='dst_bk_path',
        icon='fa fa-link fa-fw',
        placeholder='Please enter path to DST BK'
    )

    data_year = data_fields.DataYearField(
        label=_("Data"),
        export_key='data_year',
        icon='fa fa-calendar fa-fw'
    )

    reconstruction_sw = fields.FormField(
        ReconstructionSWForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='Reconstruction Software',
        widget_classes='',
        export_key='reconstruction_sw',
        icon='fa fa-repeat fa-fw'
    )

    trigger = data_fields.TriggerField(
        label=_("Trigger"),
        export_key='trigger',
        icon='fa fa-certificate fa-fw'
    )

    trigger_details = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Trigger Details"),
        export_key='trigger_details',
        icon='fa fa-align-justify fa-fw',
        placeholder='Please enter any necessary trigger details'
    )

    stripping_sw = fields.FormField(
        StrippingSWForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='Stripping Software',
        widget_classes='',
        export_key='stripping_sw',
        icon='fa fa-tint fa-fw'
    )

    stripping_line = data_fields.TextField(
        widget_classes='form-control',
        label=_("Stripping Line"),
        export_key='stripping_line',
        icon='fa fa-flash fa-fw',
        placeholder='???'
    )

    analysis_software = fields.FormField(
        AnalysisSWForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='Analysis Software',
        widget_classes='',
        export_key='analysis_software',
        icon='fa fa-tint fa-fw'
    )

    # Event Samples MC

    mc_monte_carlo = data_fields.MonteCarloField(
        label=_("Monte Carlo"),
        export_key='mc_monte_carlo',
        icon='fa fa-globe fa-fw'
    )

    mc_monte_carlo_samples = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Monte Carlo Samples"),
        export_key='mc_monte_carlo_samples',
        icon='fa fa-align-justify fa-fw',
        placeholder='???'
    )

    mc_bk_path = data_fields.TextField(
        label=_("MC BK Path"),
        placeholder='Please enter full path to data',
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-12 col-pad-0"),
        export_key='mc_bk_path',
        description="""Example: sim://MC/MC11a/Beam3500GeV-2011-MagDown-Nu2-5\
        0ns-EmNoCuts/Sim05a/Trig0x40760037Flagged/Reco12a/Stripping17NoPresca\
        lingFlagged/42""",
        icon='fa fa-link fa-fw'
    )

    mc_data_year = data_fields.DataYearField(
        label=_("Data"),
        export_key='mc_data_year',
        icon='fa fa-calendar fa-fw'
    )

    mc_reconstruction_sw = fields.FormField(
        ReconstructionSWForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='Reconstruction Software',
        widget_classes='',
        export_key='mc_reconstruction_sw',
        icon='fa fa-repeat fa-fw'
    )

    mc_trigger = data_fields.TriggerField(
        label=_("Trigger"),
        export_key='mc_trigger',
        icon='fa fa-certificate fa-fw'
    )

    mc_trigger_details = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Trigger Details"),
        export_key='mc_trigger_details',
        icon='fa fa-align-justify fa-fw',
        placeholder='Please enter any necessary trigger details'
    )

    mc_stripping_sw = fields.FormField(
        StrippingSWForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='Stripping Software',
        widget_classes='',
        export_key='mc_stripping_sw',
        icon='fa fa-tint fa-fw'
    )

    mc_stripping_line = data_fields.TextField(
        widget_classes='form-control',
        label=_("Stripping Line"),
        export_key='mc_stripping_line',
        icon='fa fa-flash fa-fw',
        placeholder='???'
    )

    mc_analysis_software = fields.FormField(
        AnalysisSWForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='Analysis Software',
        widget_classes='',
        export_key='mc_analysis_software',
        icon='fa fa-tint fa-fw'
    )

    # User Code

    platform = data_fields.TextField(
        label=_("Platform"),
        placeholder="Please state platform  E.g. x86_64-slc5-gcc46-opt",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-12 col-pad-0"),
        export_key='platform',
        icon='fa fa-leaf fa-fw'
    )

    user_code = fields.FormField(
        UserCodeForm,
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        label='User Code',
        icon='fa fa-link fa-fw',
        widget_classes='',
        export_key='user_code',
    )

    code_type = data_fields.CodeTypeField(
        widget_classes='form-control',
        export_key='code_type',
        icon='fa fa-cog fa-fw'
    )

    code_type_other = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Other"),
        export_key='code_type_other',
        icon='fa fa-align-justify fa-fw',
        placeholder="Please specify the code type",
        hidden=True,
        )

    code_comment = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Code Comment"),
        export_key='code_comment',
        icon='fa fa-align-justify fa-fw',
        placeholder='Please enter any relevent code comments'
    )

    reproduce = data_fields.ReproduceField(
        label='How to reproduce',
        icon='fa fa-user fa-fw',
        widget_classes='form-control',
        export_key='reproduce',
    )

    reproduce_upload = data_fields.FileUploadField(
        label='',
        hidden=True,
        disabled=False,
        widget=plupload_widget,
        export_key=False,
        validators=[
            required_if('reproduce', ['other'])
        ],
    )

    # Final N Tuples

    final_n_tuples = fields.DynamicFieldList(
        fields.FormField(
            FinalNTuplesForm,
            widget=ExtendedListWidget(
                item_widget=ItemWidget(),
                html_tag='div'
            ),
        ),
        label=_("Output Data Files"),
        icon='fa fa-file fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='final_n_tuples',
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
        label=_("Internal Documentation"),
        icon='fa fa-file fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='internal_docs',
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
        widget_classes='form-control',
        label=_("arXiv ID"),
        placeholder='arXiv:1413.9999',
        export_key='arxiv_id',
        icon='fa fa-bookmark fa-fw'
    )

    """ Form Configuration variables """
    _title = _('Submit an Analysis for LHCb')
    _subtitle = "Acess to all submitted data will be restricted to the "\
                "LHCb collaboration only."
    _drafting = True   # enable and disable drafting

    # Group fields in categories

    groups = [
        ('Basic Information',
            ['analysisname', 'analysisnum', 'title', 'authors',
                'abstract', 'accelerator', 'experiment']),
        ('Event Samples - Data',
            ['dst_bk_path', 'data_year', 'reconstruction_sw', 'trigger',
                'trigger_details', 'stripping_sw', 'stripping_line',
                'analysis_software']),
        ('Event Samples MC',
            ['mc_monte_carlo', 'mc_monte_carlo_samples', 'mc_bk_path',
                'mc_data_year', 'mc_reconstruction_sw', 'mc_trigger',
                'mc_trigger_details', 'mc_stripping_sw', 'mc_stripping_line',
                'mc_analysis_software']),
        ('User Code',
            ['platform', 'user_code', 'code_type', 'code_type_other',
             'code_comment', 'reproduce', 'reproduce_upload']),
        ('Final N Tuples',
            ['final_n_tuples']),
        ('Internal Documentation',
            ['internal_docs']),
        ('Internal Discussion',
            ['egroup']),
        ('Presented already?',
            ['internal_talks', 'public_talks']),
        ('Published already?',
            ['journal_title', 'journal_year', 'journal_volume',
                'journal_page', 'arXiv_id'])
    ]
