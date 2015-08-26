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

from wtforms.validators import Optional, DataRequired
from wtforms import widgets
from invenio.base.i18n import _
from invenio_deposit.form import WebDepositForm
from invenio_deposit import fields
from invenio_deposit.field_widgets import plupload_widget, \
    ExtendedListWidget, ColumnInput, ItemWidget
from invenio_deposit.validation_utils import required_if

from .. import fields as data_fields
from ..fields.triggers import triggers

__all__ = ('CMSStatisticsQuestionnaire', )


def create_fieldwithother(main, **kwargs):
    class FieldWithOther(WebDepositForm):
        pass

    setattr(FieldWithOther, 'main', main)

    other_defaults = dict(
        placeholder=_('Additional comments'),
        widget_classes='form-control',
    )
    other_defaults.update(kwargs.pop('other_args', dict()))
    setattr(FieldWithOther, 'other', data_fields.TextAreaField(**other_defaults))

    add_fields = kwargs.pop('add_fields', dict())
    for name, field in add_fields.iteritems():
        setattr(FieldWithOther, name, field)

    defaults = dict(
        widget=ExtendedListWidget(
            item_widget=ItemWidget(),
            html_tag='div'
        ),
        widget_classes='',
        export_key='pre_software'
    )
    defaults.update(kwargs)

    return fields.FormField(
        FieldWithOther,
        **defaults
    )


class RadioListField(fields.RadioField):
    def __init__(self, **kwargs):
        defaults = dict(
            widget_classes='form-group list-default',
            widget=ColumnInput(class_='radio',
                               widget=widgets.ListWidget(prefix_label=False)),
            validators=[Optional()]
        )
        defaults.update(kwargs)
        super(RadioListField, self).__init__(**defaults)


class YesNoField(fields.RadioField):
    def __init__(self, **kwargs):
        defaults = dict(
            widget_classes='form-group list-default',
            widget=ColumnInput(class_='radio',
                               widget=widgets.ListWidget(prefix_label=False)),
            choices=[('yes', _('yes')),
                     ('no', _('no'))]
        )
        defaults.update(kwargs)
        super(YesNoField, self).__init__(**defaults)


class MultiCheckboxField(fields.SelectMultipleField):
    def __init__(self, **kwargs):
        defaults = dict(
            widget_classes='form-group list-default',
            widget=ColumnInput(class_='checkbox',
                               widget=widgets.ListWidget(prefix_label=False)),
            option_widget=widgets.CheckboxInput()
        )
        defaults.update(kwargs)
        super(MultiCheckboxField, self).__init__(**defaults)


class CMSStatisticsQuestionnaire(WebDepositForm):
    """Deposition Form"""

    """ Form Configuration variables """
    _name = 'questions'
    _title = _('CMS Statistics Questionnaire (old)')
    _subtitle = "Access to all submitted data will be restricted to the "\
                "CMS collaboration only."
    _drafting = True   # enable and disable drafting

    # ------------------------------------------------------------------------
    # --- Intro --------------------------------------------------------------
    # ------------------------------------------------------------------------
    intro = fields.JinjaField(
        template='deposit/cmsquestions/intro.html',
        label=''
    )

    # ------------------------------------------------------------------------
    # --- Analysis Context ---------------------------------------------------
    # ------------------------------------------------------------------------
    context_name = data_fields.TextField(
        label=_('Your name'),
        widget_classes='form-control',
        export_key='context_name',
        validators=[DataRequired()]
    )

    context_email = data_fields.TextField(
        label=_('Your email address'),
        widget_classes='form-control',
        export_key='context_email',
        validators=[DataRequired()]
    )

    wgroups = [
        ('BPH', _('B physics and quarkonia (BPH)')),
        ('B2G', _('Beyond-two-generations (B2G)')),
        ('EXO', _('Exotica (EXO)')),
        ('FSQ', _('Forward and Small-x QCD physics (FSQ)')),
        ('HIG', _('Higgs physics (HIG)')),
        ('HIN', _('Heavy ions physics (HIN)')),
        ('SMP', _('Standard Model physics (SMP)')),
        ('SUS', _('Supersymmetry (SUS)')),
        ('TOP', _('Top physics (TOP)')),
        ('other', _('other (please specify in "Additional comments")'))
    ]
    context_wg = create_fieldwithother(
        fields.SelectField(
            widget_classes='form-control',
            choices=wgroups,
            export_key='context_wg',
            validators=[DataRequired()]
        ),
        label=_('Working group'),
    )

    context_cadi = data_fields.TextField(
        label=_('CADI entry number, if available'),
        description=_('(e.g., HIG-11-032)'),
        widget_classes='form-control',
        export_key='context_cadi',
    )

    context_reference = data_fields.TextField(
        label=_('If no CADI entry is available, please provide the title and applicable references'),
        description=_('(analysis note numbers, etc.)'),
        widget_classes='form-control',
        export_key='context_reference',
    )

    context_abstract = fields.TextAreaField(
        label=_('Abstract'),
        widget_classes='form-control',
        export_key='context_abstract',
        validators=[DataRequired()]
    )

    context_related = fields.TextAreaField(
        label=_('CADI entry numbers of analyses with same/similar statistical treatment'),
        description=_('including earlier version of this analysis, if applicable. Please point out all relevant similarities / differences.'),
        widget_classes='form-control',
        export_key='context_related',
    )

    # ------------------------------------------------------------------------
    # --- General Information ------------------------------------------------
    # ------------------------------------------------------------------------
    general_intro = fields.JinjaField(
        template='deposit/cmsquestions/general.html',
        label=''
    )

    general_faqaware = YesNoField(
        label=_('FAQ Awareness'),
        preamble=_('Are you aware that the Statistics Committee has a TWiki page which links a number of short documents describing recommendations for statistical techniques, including e.g., Frequently Asked Questions, and a page of statistics-related references you can cite?'),
        validators=[DataRequired()]
    )

    general_listaware = YesNoField(
        label=_('Forum/List Awareness'),
        preamble=_('Are you aware that the Statistics Committee will make an effort to promptly answer your question on statistics issues if sent via the Statistics Discussions Hypernews forum, or to the Committee\'s mailing list cms-statistics-committee@cern.ch?'),
        validators=[DataRequired()]
    )

    general_listsubscribed = YesNoField(
        label=_('Forum/List Subscription'),
        preamble=_('Have you subscribed yet to the Statistics Discussions Hypernews forum (if not, we suggest that you do)?'),
        validators=[DataRequired()]
    )

    general_pastinteraction = YesNoField(
        label=_('Past Interaction'),
        preamble=_('Have you interacted with the Statistics Committee in the past (via email, HN, or in person) to discuss an issue with a CMS analysis?'),
        validators=[DataRequired()]
    )

    general_openmeetings = YesNoField(
        label=_('Open Meetings Awareness'),
        preamble=_('Are you aware that the Statistics Committee meets regularly (Vidyo only; look for announcement in Statistics Discussions HN forum) and that everybody is welcome to participate?'),
        validators=[DataRequired()]
    )


    # ------------------------------------------------------------------------
    # --- Multivariate Discriminants -----------------------------------------
    # ------------------------------------------------------------------------
    multiv_intro = fields.JinjaField(
        template='deposit/cmsquestions/multiv.html',
        label=''
    )

    multiv_readtwiki = YesNoField(
        label=_('TWiki Read'),
        preamble=_('Have you read the TWiki mentioned above?'),
        validators=[DataRequired()]
    )

    multiv_using = YesNoField(
        label=_('Usage of multi-variante descriminant'),
        preamble=_('Are you using a multi-variate discriminant in your data analysis to discriminate between signal and background? If the answer is "No", please proceed with the next section.'),
        validators=[DataRequired()]
    )

    multiv_software = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('tmva', _('TMVA')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Used Software'),
        preamble=_('What software are you using?')
    )

    multiv_type = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('bdt', _('Boosted decision Trees')),
                ('fisher', _('Fisher Discriminant')),
                ('plikelihood', _('Product of projected likelihoods')),
                ('nn', _('Artificial Neural Network')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Used Type'),
        preamble=_('What type of discriminant do you use?')
    )

    multiv_outputuse = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('cut', _('We cut on the output to improve S/B')),
                ('fit', _('We fit the output distribution to get the signal fraction.')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('MVA output usage'),
        preamble=_('How do you make use of the MVA output in the analysis?')
    )

    multiv_inputchecks = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('oned', _('We study all 1D distributions.')),
                ('twod', _('We study all 2D distributions.')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Input variable checks'),
        preamble=_('How have you checked that the input variables, including their dependencies, are well-modeled?')
    )

    multiv_inputcorrelations = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('linear', _('We study the correlation matrix between input variables.')),
                ('nonlinear', _('We also study dependencies beyond linear correlation (please specify in "Additional comments").')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Study of correlalations/dependencies'),
        preamble=_('Do you study the correlations and dependencies between the input variables?')
    )

    multiv_variableselection = create_fieldwithother(
        RadioListField(
            choices=[
                ('yes', _('Yes, we use the correlation matrix and remove highly correlated variables.')),
                ('no', _('No, we keep the complete list.')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Input variable selection'),
        preamble=_('How do you select the input variables? Do you perform any pruning of your initial list of input variables, based on the correlations or dependencies between the input variables?')
    )

    multiv_nullpdf = create_fieldwithother(
        RadioListField(
            choices=[
                ('didntstudy', _('We do not study that.')),
                ('doesnotapply', _('Yes, but this does not apply to my analysis.')),
                ('large', _('Yes, I make training samples large enough and I checked that this does not occur.')),
                ('willcheck', _('Yes, and I need to check whether this applies to my analysis.')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Null PDF'),
        preamble=_('Are you aware that some MVA techniques may classify data events as very signal-like if any of their variables take values in regions where the background training samples have no events?')
    )

    multiv_bkgmix = create_fieldwithother(
        RadioListField(
            choices=[
                ('undecided', _('We do not study that.')),
                ('yes', _('Yes, but this does not apply to my analysis.')),
                ('doesnotapply', _('Yes, and I need to check whether this applies to my analysis.')),
                ('no', _('No (please specify in "Additional comments")'))
            ]
        ),
        label=_('Background Mix'),
        preamble=_('When training with more than one background, do you mix all samples in the proportions you expect in data?')
    )

    multiv_overtraining = create_fieldwithother(
        RadioListField(
            choices=[
                ('nochecks', _('We do not perform any checks.')),
                ('dividesample', _('We divide the sample into two subsamples: one used exclusively for training, and the other for all subsequent analysis (optimizations, analysis plots, measurements using the discriminant, etc.).')),
                ('yes', _('We do perform checks (please specify in "Additional comments")'))
            ]
        ),
        label=_('Overtraining Checks'),
        preamble=_('How do you make sure you are not affected by overtraining?')
    )

    multiv_robustness = create_fieldwithother(
        RadioListField(
            choices=[
                ('nochecks', _('We do not perform any checks.')),
                ('yes', _('Yes')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Robustness Checks'),
        preamble=_('Do you perform the following robustness check?')
    )

    # ------------------------------------------------------------------------
    # --- Data fitting -------------------------------------------------------
    # ------------------------------------------------------------------------
    fitting_using = RadioListField(
        choices=[
            ('undecided', _('Undecided')),
            ('yes', _('Yes')),
            ('no', _('No'))
        ],
        label=_('Usage of fitting of data distributions'),
        preamble=_('Does the analysis include fitting of data distributions? If the answer is "No", please proceed with the next section.'),
        validators=[DataRequired()]
    )

    fitting_functionalform = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('templates', _('Histograms/Templates')),
                ('parametric', _('Parametric curves/pdfs')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Functional Form'),
        preamble=_('What functional form is used?')
    )

    fitting_modelchoice = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('mctemplates', _('Histograms/Templates from MC')),
                ('sbtemplates', _('Histograms/Templates from a data sideband')),
                ('theorycurve', _('Theory curve(s)')),
                ('theoryinspired', _('Theory-inspired curve(s)')),
                ('adhoc', _('Ad-hoc curve(s)')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Fitting Model Choice'),
        preamble=_('How do you choose the fitting model?')
    )

    fitting_teststat = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('chi2', _('chi-square')),
                ('binnedl', _('binned likelihood')),
                ('unbinnedl', _('unbinned likelihood')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        add_fields=dict(
            reason=fields.TextAreaField(
                placeholder=_('What drove you to this particular choice?'),
                widget_classes='form-control',
                export_key='fitting_teststat_reason'
            )
        ),
        label=_('Test Statistic'),
        preamble=_('Which test statistic are you using to perform the fit(s)?')
    )

    fitting_gof = create_fieldwithother(
        RadioListField(
            choices=[
                ('undecided', _('Undecided')),
                ('yes', _('Yes')),
                ('no', _('No')),
            ]
        ),
        add_fields=dict(
            details=MultiCheckboxField(
                choices=[
                    ('dontknow', _('Don\'t know')),
                    ('1tp1', _('<0.1%%')),
                    ('p1to1', _('0.1%%-1%%')),
                    ('oneto5', _('1%%-5%%')),
                    ('fiveto99', _('5%%-99%%')),
                    ('nnto99p9', _('99%%-99.9%%')),
                    ('gt99p9', _('>99.9%%')),
                ]
            )
        ),
        label=_('Goodness-Of-Fit Test (incl. p-values)'),
        preamble=_('Do you perform a goodness-of-fit test for the fit(s)? If "Yes" or "Undecided", provide additional information and the resultung p-values(s).')
    )

    fitting_pulls = create_fieldwithother(
        RadioListField(
            choices=[
                ('dontcheck', _('We do not check that.')),
                ('noneed', _('No, but we do not use the uncertainty returned by the fit anyway.')),
                ('checkedok', _('Yes, and the result is that the method is unbiased.')),
                ('checkcorrectbias', _('Yes, and there are some deviations we account for (please specify in "Additional comments").')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Check of Pull Distributions in Toy Experiments'),
        preamble=_('Do you check that the pull distribution in toy experiments is distributed as expected for an unbiased method (mean 0, width 1)?')
    )

    fitting_cov = create_fieldwithother(
        RadioListField(
            choices=[
                ('doesntapply', _('Does not apply: We do not use the parameters / uncertainties elsewhere.')),
                ('yes', _('Yes')),
                ('no', _('No'))
            ]
        ),
        label=_('Covariance Matrix Check'),
        preamble=_('In case you are using the returned parameters in other parts of your analysis: are you accounting for the covariance matrix (error and off-diagonal correlation terms) of the parameter uncertainties?')
    )

    fitting_shapechoice = create_fieldwithother(
        RadioListField(
            choices=[
                ('doesntapply', _('Does not apply: We do not perform this kind of fitting.')),
                ('checks', _('We perform robustness checks to show that we are insensitive to the choice of the functional form.')),
                ('syst', _('We tried different options and assign a systematic uncertainty from the difference.')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Background Shape Choice'),
        preamble=_('In case you perform a fit to the background shape with a function: How do you choose the functional form?')
    )

    fitting_pruning = create_fieldwithother(
        RadioListField(
            choices=[
                ('doesntapply', _('Does not apply: We do not use such a function for fitting.')),
                ('looksok', _('We choose what looks more or less Ok.')),
                ('checks', _('We perform robustness checks to show that we are insensitive to this choice.')),
                ('conservative', _('We tried different options and chose the most conservative one.')),
                ('formal', _('We applied a formal decision procedure (such as Fisher F-Test, LR test, please specify in "Additional comments")')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Fit Function: Choice of Number of Parameters'),
        preamble=_('In case you perform a fit using a functional form which exists for many different number of parameters (such as polynomials): How are you choosing the number of parameters?')
    )

    fitting_boundary = create_fieldwithother(
        RadioListField(
            choices=[
                ('dontcheck', _('We do not check that.')),
                ('no', _('No')),
                ('dontneedunc', _('Yes, but we do not use the uncertainty.')),
                ('yeschecked', _('Yes, and we check that the error calculation is robust anyway.')),
                ('yestrust', _('Yes, and we trust the errors from the fitter without further checks.')),
            ]
        ),
        label=_('Parameter Boundaries'),
        preamble=_('Are any of the parameters returned by the fit close (less than 3 sigma) to their physical or pre-defined boundary?')
    )


    # ------------------------------------------------------------------------
    # --- Data fitting -------------------------------------------------------
    # ------------------------------------------------------------------------
    intervals_using = RadioListField(
        choices=[
            ('undecided', _('Undecided')),
            ('yes', _('Yes')),
            ('no', _('No'))
        ],
        label=_('Usage of confidence intervals and limits'),
        preamble=_('Does the analysis include the setting of limits on some parameter or placing a confidence interval on some parameter? If the answer is "No", please proceed with the next section.'),
        validators=[DataRequired()]
    )

    intervals_sidednessdecision = create_fieldwithother(
        RadioListField(
            choices=[
                ('undecided', _('Completely undecided')),
                ('limitonly', _('We will only cite a limit.')),
                ('twosided', _('We will only cite a two-sided interval.')),
                ('afterdata', _('We will decide that after looking at data.')),
                ('both', _('We will cite both.')),
                ('doesntapply', _('Does not apply: we use a unified interval construction approach (Feldman-Cousins)')),
            ]
        ),
        label=_('Citation of limit or two-sided confidence interval'),
        preamble=_('Will you cite a limit or a two-sided confidence interval?')
    )

    intervals_cls = RadioListField(
        choices=[
            ('doesntapply', _('Does not apply: we do not perform limit computation')),
            ('yes', _('Yes')),
            ('no', _('No'))
        ],
        label=_('ATLAS-CMS agreement'),
        preamble=_('Are you aware of the agreement between ATLAS and CMS regarding limit setting, which b other things b '),
    )

    intervals_roostatsclsfc = RadioListField(
        choices=[
            ('doesntapply', _('Does not apply: we do not perform limit computation')),
            ('yes', _('Yes')),
            ('no', _('No'))
        ],
        label=_('Awareness of Support by the Statistics Committee'),
        preamble=_('Are you aware that the Statistics Committee provides support and a simple recipe to include the derivation of Feldman-Cousins confidence intervals in RooStats jobs that are currently used to compute CLs limits?'),
    )

    intervals_prioranalysis = RadioListField(
        choices=[
            ('doesntapply', _('Does not apply: we do not use Bayesian methods')),
            ('yes', _('Yes')),
            ('no', _('No'))
        ],
        label=_('Awareness of Recommendation of Prior Sensitivity Analysis'),
        preamble=_('If you are using a Bayesian technique, are you aware that the SC recommends to perform a prior sensitivity analysis, both on the PDFs of parameters describing the systematic uncertainties (nuisance parameters) and on the PDF of the parameter to be estimated?'),
    )

    intervals_approach = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('freqlimits', _('Frequentist limits')),
                ('freqintervals', _('Frequentist intervals')),
                ('modfreq', _('Modified frequentist limits (CLs)')),
                ('pllimits', _('Profile likelihood limits')),
                ('plintervals', _('Profile likelihood intervals')),
                ('unified', _('Unified Approach (Feldman-Cousins)')),
                ('bayesianflat', _('Bayesian limits/intervals, with a flat prior for the parameter of interest')),
                ('bayesianref', _('Bayesian limits/intervals, with a reference prior for the parameter of interest')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Approach(es)'),
        preamble=_('Mark the approach(es) you are using')
    )

    intervals_software = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('combine', _('The "combine" tool from the Higgs group')),
                ('lands', _('LandS')),
                ('roostats', _('RooStats')),
                ('theta', _('theta')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Software'),
        preamble=_('What software tool are you using for your confidence interval calculations?')
    )

    intervals_ts = create_fieldwithother(
        RadioListField(
            choices=[
                ('doesntapply', _('Does not apply: the construction does not make use of a test statistic.')),
                ('lrlep', _('Likelihood ratio in which nuisance parameters and signal cross section are all fixed to a nominal value ("LEP-like").')),
                ('lrtev', _('Profile likelihood ratio in which nuisance parameters are varied in the maximization and the signal cross section parameter is fixed ("Tevatron-like").')),
                ('lrlhc', _('Profile likelihood ratio modified for upper limits in which nuisance parameters are varied in the nominator and denominator. The signal cross section mu is fixed to the currently tested point mu* in the nominator and is varied but constrained to 0 <= mu < mu* in the denominator (sometimes called the "LHC-like" test statistic; this is used in the Higgs combination).')),
                ('other', _('Other (please specify in the extra field)'))
            ]
        ),
        label=_('Test Statistic'),
        preamble=_('In the case of frequentist/CLs confidence interval construction: which test statistic do you use? If you chose "other", please specify the test statistic used. As an example of the detail you should provide: "the HCG choice is qmu = -2 Ln[L(mu, theta_mu_* )/L(mu* ,theta* )], with 0 < mu* < mu at the denominator, and the numerator has nuisances set at conditional ML estimate for data at given mu, theta_mu_*"'),
        add_fields=dict(
            tsdetail=fields.TextAreaField(
                placeholder=_('Test Statistics Details (in case of "other")'),
                widget_classes='form-control'
            )
        )
    )

    intervals_toygen = create_fieldwithother(
        RadioListField(
            choices=[
                ('doesntapply', _('Does not apply: the method does not require toys.')),
                ('prior', _('Nuisance parameters are sampled from their priors.')),
                ('bootstrapping', _('A fit to data is performed and the fitted nuisance parameter values are used for toy data generation (this is sometimes called "bootstrapping").')),
                ('notvaried', _('Nuisance parameters are not varied.')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Toy Data'),
        preamble=_('In the case toy data is generated as part of the procedureb determine the test statistic distribution or to compute the expected limit / expected limit bandsb the nuisance parameter are chosen for the toys.')
    )

    intervals_theoryerror = create_fieldwithother(
        RadioListField(
            choices=[
                ('doesntapply', _('Does not apply: we do not cite a limit / only cite a limit on the cross section itself.')),
                ('no', _('We do not account for theory uncertainties.')),
                ('band', _('We vary the theory prediction by one sigma up/down and cite the most conservative limit.')),
                ('nuisance', _('We introduce an additional nuisance parameter in the statistical model which modifies the cross section within the theory uncertainty.')),
                ('baysian', _('We perform a Bayesian integration over the theory prediction and cite the prior-averaged limit.')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Theory Error in Signal Cross Section'),
        preamble=_('In case you convert a limit on a signal cross section into a limit on the mass (or another parameter; we call it "mass" here): how do you account for the theory error on the signal cross section?')
    )


    # ------------------------------------------------------------------------
    # --- Discovery ----------------------------------------------------------
    # ------------------------------------------------------------------------
    discovery_intro = fields.JinjaField(
        template='deposit/cmsquestions/discovery.html',
        label=''
    )

    discovery_twiki = YesNoField(
        label=_('TWiki Pages Read'),
        preamble=_('Have you read the discovery-related TWiki pages mentioned above (if applicable)?'),
        validators=[DataRequired()]
    )

    discovery_using = RadioListField(
        choices=[
            ('undecided', _('Undecided')),
            ('yes', _('Yes')),
            ('no', _('No'))
        ],
        label=_('Usage'),
        preamble=_('Does the analysis include discovery-related statements, such as citing p-values of the null hypothesis or a "significance"? If the answer is "No", please proceed with the next section.'),
        validators=[DataRequired()]
    )

    discovery_ts = create_fieldwithother(
        RadioListField(
            choices=[
                ('lrlep', _('Likelihood ratio in which all nuisance parameters and parameter of interest are fixed to a nominal value')),
                ('plr', _('Profile likelihood ratio in which nuisance parameters and parameter of interest are varied in the maximisation')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Test Statistic'),
        preamble=_('To evaluate the p-value(s) of the null hypothesis, what test statistic was used?')
    )

    discovery_lee = create_fieldwithother(
        RadioListField(
            choices=[
                ('doesntapply', _('Does not apply: we only look for one signal which is completely specified (i.e., mass, width, etc. is known).')),
                ('no', _('No')),
                ('yes', _('Yes (please specify how in "Additional comments")')),
            ]
        ),
        label=_('Look-Elsewhere Effect'),
        preamble=_('Do you account for the look-elsewhere effect?')
    )


    # ------------------------------------------------------------------------
    # --- Unfolding ----------------------------------------------------------
    # ------------------------------------------------------------------------
    unfolding_intro = fields.JinjaField(
        template='deposit/cmsquestions/unfolding.html',
        label=''
    )

    unfolding_readrecomm = YesNoField(
        label=_('"Interim recommendations on unfolding techniques" Read'),
        preamble=_('Have you read the SC note on "Interim recommendations on unfolding techniques"?'),
        validators=[DataRequired()]
    )

    unfolding_using = RadioListField(
        choices=[
            ('undecided', _('Undecided')),
            ('yes', _('Yes')),
            ('no', _('No'))
        ],
        label=_('Usage'),
        preamble=_('Is unfolding used in parts of the analysis? If the answer is "No", please proceed with the next section.'),
        validators=[DataRequired()]
    )

    unfolding_binbybin = YesNoField(
        label=_('Awareness of Discouragement of Bin-By-Bin Folding'),
        preamble=_('Are you aware that the SC discourages the use of bin-by-bin unfolding, or correction factors, and in general on techniques neglecting correlations?'),
    )

    unfolding_technique = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('binbybin', _('Bin-by-bin factor')),
                ('matrixinv', _(' Matrix inversion')),
                ('regmatrixinv', _(' Generalized Matrix inversion with Tikhonov regularization (=SVD by HC6cker and Kartvelishvili / TUnfold)')),
                ('dagostini', _('D\'Agostini iterative')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Technique'),
        preamble=_('Which unfolding technique are you using?')
    )

    unfolding_software = create_fieldwithother(
        MultiCheckboxField(
            choices=[
                ('roounfold', _('RooUnfold')),
                ('tunfold', _('TUnfold (without the RooUnfold interface)')),
                ('other', _('Other (please specify in "Additional comments")'))
            ]
        ),
        label=_('Software'),
        preamble=_('Which software are you using?')
    )

    unfolding_validation = fields.TextAreaField(
        label=_('Validation'),
        preamble=_('How do you validate the unfolding procedure (e.g., comparison with other techniques, toy studies, etc.)?'),
        widget_classes='form-control'
    )

    unfolding_eventweights = create_fieldwithother(
        RadioListField(
            choices=[
                ('doesntapply', _('Does not apply: We do not use event weights for data.')),
                ('weightfirst', _('We first apply the event weight to get the new (weighted) "observed" spectrum, which is then unfolded.')),
                ('weightsmearing', _('The unfolding is based on the spectrum built from unweighted events; any weight is handled as part of the smearing matrix.')),
            ]
        ),
        label=_('Event Weight Application'),
        preamble=_('In case you apply weights to the number of observed (real data) events, e.g. to correct for trigger prescales.')
    )


    # ------------------------------------------------------------------------
    # --- Systematic Uncertainties -------------------------------------------
    # ------------------------------------------------------------------------
    systu_twiki = YesNoField(
        label=_('TWiki Pages Read'),
        preamble=_('Have you read the SC recommendation TWiki pages on systematic uncertainties?'),
        validators=[DataRequired()]
    )

    systu_systat = YesNoField(
        label=_('Consideration of Systematic Uncertainties'),
        preamble=_('Have you considered that systematic uncertainties constrained by sideband measurements in the data, and whose estimate thus depends on the size of the analyzed dataset, should be treated as statistical uncertainties?'),
        validators=[DataRequired()]
    )

    systu_priorform = YesNoField(
        label=_('Awareness of SC recommendations'),
        preamble=_('If including a systematic effect as nuisance parameter in the model, are you aware that the SC recommends the use of Gamma or Log-Normal priors instead of truncated Gaussians?'),
        validators=[DataRequired()]
    )

    systu_crosscheck = create_fieldwithother(
        RadioListField(
            choices=[
                ('undecided', _('Undecided')),
                ('yes', _('Yes')),
                ('no', _('No')),
            ],
            validators=[DataRequired()]
        ),
        label=_('Crosschecks'),
        preamble=_('Does your analysis include "cross-checks" of your method, e.g. the verification of a technique on a subsidiary set of data? If the answer is "No": Are you deriving a systematic uncertainty on your main measurement from the level of agreement you observe in the cross-check? What would you have done if the cross-check failed (e.g. p-value below 0.01, or other pre-defined criterion)?'),
        add_fields=dict(
            syst=RadioListField(
                choices=[
                    ('undecided', _('Undecided about deriving process')),
                    ('yes', _('Yes, we derive from the level of agreement')),
                    ('no', _('No, we do not derive from the level of agreement')),
                ]
            ),
            whattodo=fields.TextAreaField(
                placeholder=_('Procedure in case of cross-check failure'),
                widget_classes='form-control'
            )
        )
    )

    systu_tmorphing = create_fieldwithother(
        RadioListField(
            choices=[
                ('yes', _('No, we do not perform template morphing.')),
                ('no', _('Yes (please specify how in "Additional comments"')),
            ],
            validators=[DataRequired()]
        ),
        label=_('Template Morphing'),
        preamble=_('Do you use "template morphing" in you analysis, e.g. to model a systematic uncertainty in the statistical model?')
    )


    # ------------------------------------------------------------------------
    # --- Other Statistics Related Items -------------------------------------
    # ------------------------------------------------------------------------
    other_intro = fields.JinjaField(
        template='deposit/cmsquestions/other.html',
        label=''
    )

    other_faq = YesNoField(
        label=_('FAQ Read'),
        preamble=_('Did you check if one of the frequently asked questions apply to your analysis?'),
        validators=[DataRequired()]
    )

    other_blind = create_fieldwithother(
        RadioListField(
            choices=[
                ('dont', _('We do not perform a blind analysis: we didn\'t see how to do that practically')),
                ('doesntapply', _('We do not perform a blind analysis')),
                ('yes', _('Yes (please specify how in "Additional comments")')),
            ],
            validators=[DataRequired()]
        ),
        label=_('Blind Analysis Performed'),
        preamble=_('Do you perform a blind analysis? If so, can you succinctly describe what was done?')
    )

    other_combination = create_fieldwithother(
        RadioListField(
            choices=[
                ('doesntapply', _('Does not apply: we do not perform a combination')),
                ('blue', _('BLUE')),
                ('likelihoods', _('Combined likelihood function')),
                ('other', _('Other (please specify in "Additional comments")')),
            ],
            validators=[DataRequired()]
        ),
        label=_('Methods of Combined Measurements'),
        preamble=_('In case you combine measurements in your analysis: what method is used?')
    )

    other_cmsomb = create_fieldwithother(
        RadioListField(
            choices=[
                ('doesntapply', _('Does not apply')),
                ('yes', _(' Yes, this applies (please specify how in "Additional comments")')),
            ],
            validators=[DataRequired()]
        ),
        label=_('Correlation Treatment'),
        preamble=_('In case you use the results of another CMS analysis: how did you treat correlations from common systematic uncertainties and from potential overlap in the datasets?')
    )


    # ------------------------------------------------------------------------
    # --- Comments and Feedback ----------------------------------------------
    # ------------------------------------------------------------------------
    feedback_intro = fields.JinjaField(
        template='deposit/cmsquestions/feedback.html',
        label=''
    )

    feedback_changes = create_fieldwithother(
        RadioListField(
            choices=[
                ('all', _('Almost nothing is decided, we still expect major changes.')),
                ('triedsome', _('We already tried some methods but not yet taken a final decision which one to use.')),
                ('minor', _('Decision has been taken on methods, but still need some improvements (such as refining an implementation, etc.).')),
                ('everything', _('Everything is frozen.')),
            ],
            validators=[DataRequired()]
        ),
        label=_('Subjects to Change'),
        preamble=_('What statistical element of your analysis is not yet frozen (what changes can be expected)?')
    )

    feedback_comment = fields.TextAreaField(
        label=_('Additional Comments'),
        preamble=_('Do you have any additional comment related to the analysis? Is there a statistic-related element of your analysis not covered by this questionnaire?'),
        widget_classes='form-control',
    )

    feedback_feedback = fields.TextAreaField(
        label=_('Feedback'),
        preamble=_('Do you have a suggestion for improving this questionnaire? Do you have a suggestion for improving interaction with the CMS Statistics Committee in general or documentation of statistical recommendations?'),
        widget_classes='form-control',
    )


    groups = [
        (
            _('Intro'),
            ['intro']
        ),
        (
            _('Analysis Context'),
            ['context_name', 'context_email', 'context_wg', 'context_cadi', 'context_reference', 'context_abstract', 'context_related']
        ),
        (
            _('General Information'),
            ['general_intro', 'general_faqaware', 'general_listaware', 'general_listsubscribed', 'general_pastinteraction', 'general_openmeetings']
        ),
        (
            _('Multivariate Discriminants'),
            ['multiv_intro', 'multiv_readtwiki', 'multiv_using', 'multiv_software', 'multiv_type', 'multiv_outputuse', 'multiv_inputchecks', 'multiv_inputcorrelations', 'multiv_variableselection', 'multiv_nullpdf', 'multiv_bkgmix', 'multiv_overtraining', 'multiv_robustness']
        ),
        (
            _('Data Fitting'),
            ['fitting_using', 'fitting_functionalform', 'fitting_modelchoice', 'fitting_teststat', 'fitting_gof', 'fitting_pulls', 'fitting_cov', 'fitting_shapechoice', 'fitting_pruning', 'fitting_boundary']
        ),
        (
            _('Confidence Intervals and Limits'),
            ['intervals_using', 'intervals_sidednessdecision', 'intervals_cls', 'intervals_roostatsclsfc', 'intervals_prioranalysis', 'intervals_approach', 'intervals_software', 'intervals_ts', 'intervals_toygen', 'intervals_theoryerror']
        ),
        (
            _('Discovery'),
            ['discovery_intro', 'discovery_twiki', 'discovery_using', 'discovery_ts', 'discovery_lee']
        ),
        (
            _('Unfolding'),
            ['unfolding_intro', 'unfolding_readrecomm', 'unfolding_using', 'unfolding_binbybin', 'unfolding_technique', 'unfolding_software', 'unfolding_validation', 'unfolding_eventweights']
        ),
        (
            _('Systematic Uncertainties'),
            ['systu_twiki', 'systu_systat', 'systu_priorform', 'systu_crosscheck', 'systu_tmorphing']
        ),
        (
            _('Other Statistics Related Items'),
            ['other_intro', 'other_faq', 'other_blind', 'other_combination', 'other_cmsomb']
        ),
        (
            _('Comments and Feedback'),
            ['feedback_intro', 'feedback_changes', 'feedback_comment', 'feedback_feedback']
        )
    ]
