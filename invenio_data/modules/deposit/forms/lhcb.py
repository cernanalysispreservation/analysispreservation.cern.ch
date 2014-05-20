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

__all__ = ['LHCbDataAnalysisForm']


def keywords_autocomplete(form, field, term, limit=50):
    return [{'value': "Keyword 1"}, {'value': "Keyword 2"}]

# Subforms


class ReconstructionSWForm(WebDepositForm):
    sw = data_fields.TextField(
        placeholder="Brunel",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8"),
    )
    version = data_fields.TextField(
        placeholder="Reco13",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-4 col-pad-0"),
    )


class StrippingSWForm(WebDepositForm):
    x = data_fields.TextField(
        placeholder="DaVinciStripping",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8"),
    )
    y = data_fields.TextField(
        placeholder="17",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-4 col-pad-0"),
    )


class AnalysisSWForm(WebDepositForm):
    x = data_fields.TextField(
        placeholder="DaVinci",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-8"),
    )
    y = data_fields.TextField(
        placeholder="Version",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-4 col-pad-0"),
    )


class UserCodeForm(WebDepositForm):
    url = data_fields.TextField(
        placeholder="URL   E.g. svn@svnweb.cern.ch/cern/wsvn/myrepo",
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


class LHCbDataAnalysisForm(WebDepositForm):

    """Deposition Form"""

    # Basic Info

    analysisname = data_fields.TextField(
        widget_classes='form-control',
        label=_('Analysis Name'),
        description='E.g. Bs2JpsiKS',
        placeholder='Please enter Analysis Name',
        export_key='lhcb.analysisname',
        icon='fa fa-credit-card fa-fw',
        validators=[Required()]
    )

    analysisnum = data_fields.AnalysisNumberField(
        label=_('Analysis Number'),
        description='E.g. LHCb-ANA-2012-049',
        placeholder='Please enter Analysis Number',
        export_key='lhcb.analysisnumber',
        icon='fa fa-barcode fa-fw',
        validators=[Required()]
    )

    title = data_fields.TextField(
        label=_('Title'),
        placeholder='Auto-completed via Analysis Number',
        export_key='lhcb.title',
        widget_classes='form-control',
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
        export_key='lhcb.authors',
        hidden=True
    )

    abstract = data_fields.TextField(
        label=_('Abstract'),
        placeholder='Auto-completed via Analysis Number',
        export_key='lhcb.abstract',
        widget_classes='form-control',
        icon='fa fa-align-justify fa-fw',
        hidden=True
    )

    accelerator = data_fields.TextField(
        label=_('Accelerator'),
        placeholder='CERN LHC',
        export_key='lhcb.accelerator',
        icon='fa fa-forward fa-fw',
        widget_classes='form-control',
        hidden=True
    )

    experiments = [("LHCb", _("LHCb")),
                   ("ALICE", _("ALICE")),
                   ("CMS", _("CMS"))]
    experiment = fields.SelectField(
        label=_('Experiment'),
        choices=experiments,
        export_key='lhcb.experiment',
        icon='fa fa-magnet fa-fw',
        default='LHCb',
        widget_classes='form-control',
        hidden=True
    )

    # Event Samples - Data

    dstbkpath = data_fields.TextField(
        widget_classes='form-control',
        label=_("DST BK Path"),
        description="e.g: sim://LHCb/Collision12/Beam4000GeV-VeloClosed-MagDo\
        wn/RealData/Reco14/Stripping20/90000000 ( Full stream )/BHADR",
        export_key='lhcb.dstbkpath',
        icon='fa fa-link fa-fw',
        placeholder='Please enter path to DST BK'
    )

    data_year = data_fields.DataYearField(
        label=_("Data"),
        export_key='lhcb.data',
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
        export_key='lhcb.reconstructionsw',
        icon='fa fa-repeat fa-fw'
    )

    trigger = data_fields.TriggerField(
        label=_("Trigger"),
        export_key='lhcb.trigger',
        icon='fa fa-certificate fa-fw'
    )

    trigger_details = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Trigger Details"),
        export_key='lhcb.triggerdetails',
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
        export_key='lhcb.stripping_sw',
        icon='fa fa-tint fa-fw'
    )

    stripping_line = data_fields.TextField(
        widget_classes='form-control',
        label=_("Stripping Line"),
        export_key='lhcb.strippingline',
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
        export_key='lhcb.analysissoftware',
        icon='fa fa-tint fa-fw'
    )

    # Event Samples MC

    mc_monte_carlo = data_fields.MonteCarloField(
        label=_("Monte Carlo"),
        export_key='lhcb.montecarlo',
        icon='fa fa-globe fa-fw'
    )

    mc_monte_carlo_samples = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Monte Carlo Samples"),
        export_key='lhcb.montecarlosamples',
        icon='fa fa-align-justify fa-fw',
        placeholder='???'
    )

    mc_bk_path = data_fields.TextField(
        label=_("MC BK Path"),
        placeholder='Please enter full path to data',
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-12 col-pad-0"),
        export_key='lhcb.mcbkpath',
        description="""Example: sim://MC/MC11a/Beam3500GeV-2011-MagDown-Nu2-5\
        0ns-EmNoCuts/Sim05a/Trig0x40760037Flagged/Reco12a/Stripping17NoPresca\
        lingFlagged/42""",
        icon='fa fa-link fa-fw'
    )

    mc_data_year = data_fields.DataYearField(
        label=_("Data"),
        export_key='lhcb.mc_data',
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
        export_key='lhcb.mc_reconstructionsw',
        icon='fa fa-repeat fa-fw'
    )

    mc_trigger = data_fields.TriggerField(
        label=_("Trigger"),
        export_key='lhcb.mc_trigger',
        icon='fa fa-certificate fa-fw'
    )

    mc_trigger_details = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Trigger Details"),
        export_key='lhcb.mc_triggerdetails',
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
        export_key='lhcb.mc_strippingsw',
        icon='fa fa-tint fa-fw'
    )

    mc_stripping_line = data_fields.TextField(
        widget_classes='form-control',
        label=_("Stripping Line"),
        export_key='lhcb.mc_strippingline',
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
        export_key='lhcb.mc_analysissoftware',
        icon='fa fa-tint fa-fw'
    )

    # User Code

    platform = data_fields.TextField(
        label=_("Platform"),
        placeholder="Please state platform  E.g. x86_64-slc5-gcc46-opt",
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-12 col-pad-0"),
        export_key='lhcb.platform',
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
        export_key='lhcb.usercode',
    )

    code_type = fields.SelectField(
        widget_classes='form-control',
        label=_("Code Type"),
        choices=[('strip', 'To select stripping line'),
                 ('fit', 'To make fit'),
                 ('other', 'Other (please specify)')],
        export_key='lhcb.codetype',
        icon='fa fa-cog fa-fw'
    )

    code_comment = fields.TextAreaField(
        widget_classes='form-control',
        label=_("Code Comment"),
        export_key='lhcb.codecomment',
        icon='fa fa-align-justify fa-fw',
        placeholder='Please enter any relevent code comments'
    )

    reproduce = data_fields.ReproduceField(
        label='How to reproduce',
        icon='fa fa-user fa-fw',
        widget_classes='form-control',
        export_key='lhcb.reproduce',
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

    data_files = fields.DynamicFieldList(
        data_fields.TextField(
            label=_('Output Data Files'),
            widget_classes='form-control',
            widget=ColumnInput(class_="col-xs-10 col-pad-0"),
            placeholder="URL   E.g. root://eospublic.cern.ch//eos/"
                        "lhcb/.../myfile.root"
        ),
        label=_("Data Files"),
        icon='fa fa-file fa-fw',
        widget_classes='',
        min_entries=1,
        export_key='lhcb.datafiles',
        description="""
        Example of supported protocols:<br>
        xroot://castorpublic.cern.ch//castor/cern.ch/user/j/johndoe/mydir/myf\
        ile.root<br>
        root://eospublic.cern.ch//eos/lhcb/.../myfile.root<br>
        file:///tmp/myfile.root<br>
        http://john.doe.example.org/myfile.root<br>""",
    )

    description = data_fields.TextField(
        label='Description',
        description='E.g. data, MC...',
        widget_classes='form-control',
        widget=ColumnInput(class_="col-xs-12 col-pad-0"),
        export_key='lhcb.datafiledescription',
        icon='fa fa-align-justify fa-fw',
        placeholder='???'
    )

    data_files_harvest = data_fields.HarvestField(
        label='Harvest Code',
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
        export_key='lhcb.internaldocs',
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
        export_key='lhcb.egroup',
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
        export_key='lhcb.internaltalks',
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
        export_key='lhcb.publictalks',
    )

    # Published already?

    journal_title = data_fields.TextField(
        label=_('Journal Title'),
        placeholder='Please enter the journal title',
        export_key='lhcb.journaltitle',
        widget_classes='form-control',
        icon='fa fa-book fa-fw'
    )

    journal_year = data_fields.TextField(
        label=_('Journal Year'),
        placeholder='Please enter the journal year',
        export_key='lhcb.journalyear',
        widget_classes='form-control',
        icon='fa fa-calendar fa-fw'
    )

    journal_volume = data_fields.TextField(
        label=_('Journal Volume'),
        placeholder='Please enter the journal volume',
        export_key='lhcb.journalvolume',
        widget_classes='form-control',
        icon='fa fa-tasks fa-fw'
    )

    journal_page = data_fields.TextField(
        label=_('Journal Page'),
        placeholder='Please enter the journal page number',
        export_key='lhcb.journalpage',
        widget_classes='form-control',
        icon='fa fa-file fa-fw'
    )

    arXiv_id = data_fields.TextField(
        widget_classes='form-control',
        label=_("arXiv ID"),
        placeholder='arXiv:1413.9999',
        export_key='lhcb.arxivid',
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
            ['dstbkpath', 'data_year', 'reconstruction_sw', 'trigger',
                'trigger_details', 'stripping_sw', 'stripping_line',
                'analysis_software']),
        ('Event Samples MC',
            ['mc_monte_carlo', 'mc_monte_carlo_samples', 'mc_bk_path',
                'mc_data_year', 'mc_reconstruction_sw', 'mc_trigger',
                'mc_trigger_details', 'mc_stripping_sw', 'mc_stripping_line',
                'mc_analysis_software']),
        ('User Code',
            ['platform', 'user_code', 'code_type', 'code_comment',
                'reproduce', 'reproduce_upload']),
        ('Final N Tuples',
            ['data_files', 'description', 'data_files_harvest']),
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
