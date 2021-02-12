# * coding: utf8 *
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
# MA 021111307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.
import json
import pandas as pd

new_names = {
    'Serial': 'Serial',
    'SID': 'SID',
    'Submitted Time': 'Submitted Time',
    'Completed Time': 'Completed Time',
    'Modified Time': 'Modified Time',
    'Draft': 'Draft',
    'IP Address': 'IP Address',
    'UID': 'UID',
    'Username': 'Username',
    # 1
    '1.1. Your name': '1.1 Name',
    '1.2. Your email address': '1.2 E-mail',
    '1.3. Working group': '1.3 Working Group',
    '1.4. CADI entry number (if available)': '1.4 CADI ID',
    '1.5. Title and references (if CADI number not available)':
        '1.5 Title/References',
    '1.6. Next deadline date (typically, preapproval date)':
        '1.6 Next deadline date',
    '1.7. Three-line summary of the analysis': '1.7 Analysis Summary',
    '1.8. CADI entry numbers of analysis with same/similar '
    'statistical treatment': '1.8 Related CADI IDs',
    # 2
    '2.1. Are you aware that the Statistics Committee has a '
    'TWiki page which links a number of short documents describing '
    'recommendations for statistical techniques?': '2.1 Aware of TWiki',
    '2.2. Are you aware that the Statistics Committee will make an effort '
    'to promptly answer your question on statistics issues?':
        '2.2 Aware of SC answers',
    '2.3. Have you subscribed yet to the Statistics Discussions Hypernews '
    'forum (if not, we suggest that you do)?': '2.3 Subscribed to SDH forum',
    '2.4. Have you interacted with the Statistics Committee in the past '
    '(via email, HN, or in person) to discuss an issue with a CMS analysis ?':
        '2.4 Interaction with SC',
    '2.5. Are you aware that the Statistics Committee meets regularly '
    '(Vidyo only; look for announcement in Statistics Discussions HN forum) '
    'and that everybody is welcome to participate?':
        '2.5 Aware of SC meetings',
    # 3
    '3.1. Have you read the <a href="https://twiki.cern.ch/twiki/bin/viewauth/'
    'CMS/StatComRec-Selection">SC TWiki page on MVA recommendations</a>?':
        '3.1 Read the SC TWiki',
    '3.2. Are you using a multi-variate discriminant in your '
    'data analysis to discriminate between signal and background?':
        '3.2 Using MVD for data analysis',
    # 3.3 tools
    'R': '3.3 Tool: R',
    'TMVA': '3.3 Tool: TMVA',
    'Scikit-learn': '3.3 Tool: Sklearn',
    'Keras': '3.3 Tool: Keras',
    'Theano': '3.3 Tool: Theano',
    'Tensorflow': '3.3 Tool: Tensorflow',
    'Other (please specify below)': '3.3 Tool: Other',
    'If the software is not listed above, please specify it here':
        '3.3 Tool: Other specifics',
    # 3.4 classifiers
    'Random Forests / Boosted Decision Trees':
        '3.4 clf: Random Forests / Boosted Decision Trees',
    'Fisher Discriminant': '3.4 clf: Fisher Discriminant',
    'Product of projected likelihoods':
        '3.4 clf: Product of projected likelihoods',
    'Artificial Neural Network': '3.4 clf: Artificial Neural Network',
    'Other (please specify in the field below)': '3.4 clf: Other',
    'If the classifier is not listed above, please specify it here':
        '3.4 clf: Other specifics',
    # 3.5 mva output
    'We cut on the output to improve S/B':
        '3.5 MVA: We cut on the output to improve S/B',
    'We fit the output distribution to get the signal fraction':
        '3.5 MVA: We fit the output distribution to get the signal fraction',
    'Other (please specify in the text field below)': '3.5 MVA: Other',
    'If the use case is not listed above, please specify it here':
        '3.5 MVA: other scecifics',
    # 3.6 input checks
    'We study all 1D distributions':
        '3.6 Input: We study all 1D distributions',
    'We study all 2D distributions':
        '3.6 Input: We study all 2D distributions',
    'Other (please specify it in the text field below': '3.6 Input: Other',
    'If the check is not listed above, please specify it here':
        '3.6 Input: other specifics',
    # 3.7 correlations
    'We study the correlation matrix between the input variables':
        '3.7 Corr: We study the correlation matrix '
        'between the input variables',
    'We also study dependence beyond linear correlation (please specify '
    'details in the text field below)':
        '3.7 Corr: We also study dependence beyond linear correlation '
        '(please specify details in the text field below)',
    'Other (please specify in the textfield below)': '3.7 Corr: Other',
    'If the study you performed is not on the list, please specify it here':
        '3.7 Corr: other specifics',
    # 3.8 input selection
    'Select the way you select the input variables': '3.8 Select: input',
    'If you select the input variables in a different '
    'way, please specify it here': '3.8 Select: input other specifics',
    # 3.9 mva techinques
    'Select the way you deal with this issue': '3.9 Select: MVA techniques',
    'If none of the above, please specify here':
        '3.9 Select: MVA techniques other specifics',
    # 3.10 train sample mixing
    'Select the way you mix the samples': '3.10 Sample mix',
    'Additional comments': '3.10 Sample mix specifics',
    # 3.11 overtraining
    'Select the way you deal with overtraining': '3.11 Overtraining',
    'Additional comments.1': '3.11 Overtraining specifics',
    # 3.12 robustness check
    'Select the way you treat the check': '3.12 Robustness check',
    'Additional comments.2': '3.12 Robustness check specifics',
    # 4
    '4.1. Does the analysis include fitting of data distributions?':
        '4.1 Analysis fitting',
    '4.2. Which fits are you performing in your analysis?':
        '4.2 Analysis fitting specifics',
    # 4.3. functional forms
    'Histograms/Templates': '4.3 FF: Histograms/Templates',
    'Parametric curves/pdfs': '4.3 FF: Parametric curves/pdfs',
    'Other (please specify in "Additional Comments")': '4.3 FF: Other',
    'Additional comments.3': '4.3 Functional forms: other specifics',
    # 4.4 fitting model
    'Histograms/Templates from MC': '4.4 FM: Histograms/Templates from MC',
    'Histograms/Templates from a data sideband':
        '4.4 FM: Histograms/Templates from a data sideband',
    'Theory curve(s)': '4.4 FM: Theory curve(s)',
    'Theory-inspired curve(s)': '4.4 FM: Theory-inspired curve(s)',
    'Ad-hoc curves': '4.4 FM: Ad-hoc curves',
    'Other (please specify in "Additional Comments").1': '4.4 FM: Other',
    'Additional comments.4': '4.4 Fitting model: comments',
    # 4.5 test statistics
    'Chi-square': '4.5 Stats: Chi-square',
    'Binned likelihood': '4.5 Stats: Binned likelihood',
    'Unbinned likelihood': '4.5 Stats: Unbinned likelihood',
    'Other (please specify in "Additional Comments").2': '4.5 Stats: Other',
    'Additional comments.5': '4.5 Stats: others specifics',
    '4.5.1. What drove you to this particular choice?':
        '4.5.1 Stats: others specifics more',
    # 4.6 goodness of fit
    'Select whether you perform a GoF test': '4.6 GOF',
    'Additional comments.6': '4.6 GOF other specifics',
    "Don't know": '4.6 GOF: Don\'t know',
    '<0.1%': '4.6 GOF: <0.1%',
    '0.1%-1%': '4.6 GOF: 0.1%-1%',
    '1%-5%': '4.6 GOF: 1%-5%',
    '5%-99%': '4.6 GOF: 5%-99%',
    '99%-99.9%': '4.6 GOF: 99%-99.9%',
    '>99.9%': '4.6 GOF: >99.9%',
    # 4.7
    'Do you check it?': '4.7 check it',
    'Additional comments.7': '4.7 additional comments',
    'Are you accounting for the covariance matrix?': '4.8 cov matrix',
    'Additional comments.8': '4.8 cov matrix additional',
    'Select the way you choose your functional form': '4.9 func form',
    'Additional comments.9': '4.9 func form additional',
    'Select the way you choose the number of parameters':
        '4.10 number of parameters',
    'Additional comments.10': '4.10 number of parameters additional',
    'Select the answer that applies': '4.11 select',
    'Additional comments.11': '4.11 additional',
    # 5.1
    '5.1. Does the analysis include the setting of limits on some parameter '
    'or placing a confidence interval on some parameter?':
        '5.1 limits on parameters',
    'Select the answer that applies.1': '5.2 select',
    'Additional comments.12': '5.2 additional',
    '5.3. Are you aware of the agreement between ATLAS and CMS regarding '
    'limit setting, which — among other things — requires the CLs method '
    'for Higgs and SUSY analyses?': '5.3 agreement cms atlas',
    '5.4. Are you aware that the Statistics Committee provides support and a '
    'simple recipe to include the derivation of Feldman-Cousins confidence '
    'intervals in RooStats jobs that are '
    'currently used to compute CLs limits?': '5.4 sc support',
    '5.5. If you are using a Bayesian technique, are you aware that the SC '
    'recommends to perform a prior sensitivity analysis, both on the PDFs of '
    'parameters describing the systematic uncertainties (nuisance parameters) '
    'and on the PDF of the parameter to be estimated?': '5.5 byesian',
    # 5.6
    'Frequentist limits': '5.6 BA: Frequentist limits',
    'Frequentist intervals': '5.6 BA: Frequentist intervals',
    'Modified frequentist limits (CLs)':
        '5.6 BA: Modified frequentist limits (CLs)',
    'Profile likelihood limits': '5.6 BA: Profile likelihood limits',
    'Profile likelihood intervals': '5.6 BA: Profile likelihood intervals',
    'Unified approach (Feldman-Cousins)':
        '5.6 BA: Unified approach (Feldman-Cousins)',
    'Bayesian limits/intervals, with a flat priori for '
    'the parameter of interest':
        '5.6 BA: Bayesian limits/intervals, with a '
        'flat priori for the parameter of interest',
    'Bayesian limits/intervals, with a reference prior '
    'for the parameter of interest':
        '5.6 BA: Bayesian limits/intervals, with a reference prior '
        'for the parameter of interest',
    'Other (please specify in "Additional Comments").3': '5.6 BA: Other',
    'Additional comments.13': '5.6 comments',
    # 5.7
    'The CMS Higgs Combination Tool ("combine")':
        '5.7 CI: The CMS Higgs Combination Tool ("combine")',
    'LandS': '5.7 CI: LandS',
    'RooStats (by hand)': '5.7 CI: RooStats (by hand)',
    'Theta': '5.7 CI: Theta',
    'Other (please specify in "Additional Comments").4': '5.7 CI: Other',
    'Additional comments.14': '5.7 comments',
    # 5.8
    'Select the answer that applies.2': '5.8 select',
    '5.8.1. If you chose "other" in the previous question, '
    'please specify the test statistic used here.': '5.8.1 other',
    'Additional comments.15': '5.8 comments',
    # 5.9
    'Select the answer that applies.3': '5.9 select',
    '5.9.1. If you choose "Yes" in the previous question, did you make a '
    'cross check with toys, e.g. checking the agreement of toy and '
    'asymptotics based upper limits for some exemplary values of new physics '
    'model parameters such as the mass of a new particle?':
        '5.9.1 cross check',
    # 5.10
    'Select the answer that applies.4': '5.10 select',
    'Additional comments.16': '5.10 comments',
    # 5.11
    'Select the answer that applies.5': '5.11 select',
    'Additional comments.17': '5.11 comments',
    # 6
    '6.1. Have you read the discovery-related TWiki pages on Search '
    'Procedures, Sensitivity Calculations, and Look-Elsewhere Effect '
    '(if applicable)?': '6.1 select',
    '6.2. Does the analysis include discovery-related statements, such as '
    'citing p-values of the null hypothesis or a "significance"?':
        '6.2 p-vals',
    # 6.3
    'Select the answer that applies.6': '6.3 select',
    'Additional comments.18': '6.3 other',
    'Select the answer that applies.7': '6.4 select',
    'Additional comments.19': '6.4 other',
    '7.1. Is unfolding used in parts of the analysis?': '7.1 unfolding',
    '7.2. Have you read the <a href="https://twiki.cern.ch/twiki/bin/'
    'view/CMS/ScrecUnfolding">SC TWiki page on recommendations for '
    'unfolding techniques</a>?': '7.2 unfolding',
    '7.3. Are you aware that the SC discourages the use of bin-by-bin '
    'unfolding, or correction factors, and in general on techniques '
    'neglecting correlations?': '7.3 sc unfolding',
    # 7.4
    'Select the answer that applies.8': '7.4 select',
    'Additional comments.20': '7.4 other',
    # 7.5
    'Select the answer that applies.9': '7.5 select',
    'Additional comments.21': '7.5 other',
    # 7.6
    'Select the answer that applies.10': '7.6 select',
    'Additional comments.22': '7.6 other',
    '7.7. The condition number of the response matrix (it can be determined '
    'using e.g. the TDecompSVD class in ROOT) can be a good indicator of '
    'whether regularization is needed or not. What is its value?':
        '7.7 resp matrix',
    "7.8. If you have performed unfolding with regularization, by which "
    "objective criterion have you chosen the regularization parameter (number "
    "of iterations in case of D'Agostini or other iterative unfolding "
    "methods)?": '7.8 regularization on unfolding',
    # 7.9
    '7.9.1. Have you used toy experiments to verify the coverage of the '
    'unfolded uncertainties?': '7.9.1 experiments',
    '7.9.2. Which other checks have you performed for validation (e.g. '
    'comparison with other techniques, unfolding reweighted MCs, unfolding '
    'one fully simulated MC using a MC with a different physics model for the '
    'response matrix and regularization, etc.)?': '7.9.2 checks',
    'Select the answer that applies.11': '7.9.3 select',
    'Additional comments.23': '7.9.3 other',
    # 7.10
    'Select the answer that applies.12': '7.10 select',
    'Additional comments.24': '7.10 other',
    # 7.11
    '7.11.1. The unfolded histogram and its total covariance matrix':
        '7.11.1 hist/cov matrix',
    '7.11.2. The response matrix K as a coloured 2D histogram':
        '7.11.2 resp matrix',
    'Other (specify)': '7.11 other',
    # 8
    '8.1. Have you read the SC recommendation TWiki pages on '
    'systematic uncertainties?': '8.1 sc recommendation twiki',
    '8.2. Have you considered that systematic uncertainties constrained by '
    'sideband measurements in the data, and whose estimate thus depends on '
    'the size of the analyzed dataset, should be treated as statistical '
    'uncertainties?': '8.2 systematic uncertainties',
    '8.3. If including a systematic effect as nuisance parameter in the '
    'model, are you aware that the SC recommends the use of Gamma or '
    'Log-Normal priors instead of truncated Gaussians?':
        '8.3 systematic effect',
    # 8.4
    'Select the answer that applies.13': '8.4 select',
    '8.4.1. Are you deriving a systematic uncertainty on your main '
    'measurement from the level of agreement you observe in the cross-check?':
        '8.4.1 uncertainty',
    '8.4.2. What would you have done if the cross-check failed (e.g. p-value '
    'below 0.01, or other pre-defined criterion)?':
        '8.4.2 failure cross-check',
    'Additional comments.25': '8.4 comments',
    # 8.5
    'Select the answer that applies.14': '8.5 select',
    'Additional comments.26': '8.5 other',
    # 9
    'Select the answer that applies.15': '9.1 pdf uncertainty',
    'Additional comments.27': '9.1 pdf comments',
    # 9.2
    'Select the answer that applies.16': '9.2 select',
    '9.2.1. How do you estimate the sensitivity of Your observable to '
    'QCD parameters/PDFs?': '9.2.1 sensitivity',
    '9.2.2. Do you plan to provide Your measurement to HEPDATA including '
    'correlation matrices to be used by PDF groups? '
    '(The PDF forum provides support for pushing measurements to HEPDATA.)':
        '9.2.2 hepdata',
    'Additional comments.28': '9.2 comments',
    # 9.3
    'Select the answer that applies.17': '9.3.1 select',
    'Additional comments.29': '9.3.1 comments',
    'Select the answer that applies.18': '9.3.2 select',
    'Additional comments.30': '9.3.2 comments',
    '9.3.3. Did you properly cite every PDF set employed even when used only '
    'within the context of the PDF4LHC recommendation or CMS or META PDFs?':
        '9.3.3 pdf citation',
    '9.3.4. Do you estimate the PDF uncertainty on your prediction using the '
    'procedure described in the publication of the particular PDF you use?':
        '9.3.4 pdf uncertainty',
    # 10
    'Select the answer that applies.19': '10.3 select',
    'Additional comments.31': '10.3 other',
    'Select the answer that applies.20': '10.2 select',
    'Additional comments.32': '10.2 other',
    'Select the answer that applies.21': '10.1 select',
    'Additional comments.33': '10.1 other',
    # 11
    'Select the answer that applies.22': '11.1 select',
    'Additional comments.34': '11.1 other',
    '11.2. Do you have any additional comment related to the analysis? Is '
    'there a statistic-related element of your analysis not covered by this '
    'questionnaire?': '11.2 additional comments',
    '11.3. Do you have a suggestion for improving this questionnaire? Do you '
    'have a suggestion for improving interaction with the CMS Statistics '
    'Committee in general or documentation of statistical recommendations?':
        '11.3 suggestions'
}

WG_MAP = {
    "B physics and quarkonia (BPH)": "BPH",
    "Future (FTR)": "FTR",
    "Beyond-two-generations (B2G)": "B2G",
    "Exotica (EXO)": "EXO",
    "Higgs physics (HIG)": "HIG",
    "Heavy ions physics (HIN)": "HIN",
    "Standard Model physics (SMP)": "SMP",
    "Supersymmetry (SUS)": "SUS",
    "Top physics (TOP)": "TOP",
    "Physics of the CMS-Totem Precision Proton Spectometer (PPS)": "PPS",
    "Other (please specify)": "other",
}


def extract_questionnaires_from_excel(file):
    df = pd.read_excel(file, header=None, index=False, engine='openpyxl')
    replaceable = {i: new_names[key] for i, key in enumerate(new_names.keys())}

    df = df.iloc[8:]
    df.reset_index(drop=True, inplace=True)
    df.rename(columns=replaceable, inplace=True)
    df['1.6 Next deadline date'] = \
        df['1.6 Next deadline date'].dt.strftime('%Y-%m-%d')

    data = json.loads(df.T.to_json())
    keys = [str(i) for i in range(len(data.keys()))]

    answers = []
    for key in keys:
        answers.append(data[key])

    nested_answers = []

    for ans in answers:
        new_ans = {}

        new_ans['_general_info'] = {
            'serial': ans['Serial'],
            'user': ans['Username']
        }

        try:
            _wg = WG_MAP[ans['1.3 Working Group']]
        except Exception:
            _wg = "other"
        # 1
        new_ans["analysis_context"] = {
            "name": ans['1.1 Name'],
            "email": ans['1.2 E-mail'],
            "wg": _wg,
            "cadi_id": ans['1.4 CADI ID'],
            "title_references": ans['1.5 Title/References'],
            "next_deadline_date": ans['1.6 Next deadline date'],
            "analysis_summary": ans['1.7 Analysis Summary'],
            "related_cadi_ids": ans['1.8 Related CADI IDs']
        }

        # 2
        new_ans["general_information"] = {
            "aware_twiki": ans['2.1 Aware of TWiki'],
            "aware_sc_answer": ans['2.2 Aware of SC answers'],
            "hn_subscription": ans['2.3 Subscribed to SDH forum'],
            "sc_interaction": ans['2.4 Interaction with SC'],
            "aware_sc_meetings": ans['2.5 Aware of SC meetings']
        }

        # 3
        new_ans['multivariate_discriminants'] = {
            "read_sc_twiki": ans['3.1 Read the SC TWiki'],
            "mva_use": ans['3.2 Using MVD for data analysis'],
            "tools": {
                "options": [
                    x.split('Tool: ')[-1]
                    for x in ['3.3 Tool: R', '3.3 Tool: TMVA',
                              '3.3 Tool: Sklearn', '3.3 Tool: Keras',
                              '3.3 Tool: Theano', '3.3 Tool: Tensorflow',
                              '3.3 Tool: Other']
                    if ans[x]
                ],
                "other": ans['3.3 Tool: Other specifics']
            },
            "clf": {
                "options": [
                    x.split('clf: ')[-1]
                    for x in ['3.4 clf: Random Forests / '
                              'Boosted Decision Trees',
                              '3.4 clf: Fisher Discriminant',
                              '3.4 clf: Product of projected likelihoods',
                              '3.4 clf: Artificial Neural Network',
                              '3.4 clf: Other']
                    if ans[x]
                ],
                "other": ans['3.4 clf: Other specifics']
            },
            "mva": {
                "options": [
                    x.split('MVA: ')[-1]
                    for x in ['3.5 MVA: We cut on the output to improve S/B',
                              '3.5 MVA: We fit the output distribution to '
                              'get the signal fraction',
                              '3.5 MVA: Other']
                    if ans[x]
                ],
                "other": ans['3.5 MVA: other scecifics']
            },
            "input": {
                "options": [
                    x.split('Input: ')[-1]
                    for x in ['3.6 Input: We study all 1D distributions',
                              '3.6 Input: We study all 2D distributions',
                              '3.6 Input: Other']
                    if ans[x]
                ],
                "other": ans['3.6 Input: other specifics']
            },
            "correlation": {
                "options": [
                    x.split('Corr: ')[-1]
                    for x in ['3.7 Corr: We study the correlation matrix '
                              'between the input variables',
                              '3.7 Corr: We also study dependence beyond '
                              'linear correlation (please specify details '
                              'in the text field below)',
                              '3.7 Corr: Other']
                    if ans[x]
                ],
                "other": ans['3.7 Corr: other specifics']
            },
            "input_selection": {
                "options": ans['3.8 Select: input'],
                "other":
                    ans['3.8 Select: input other specifics']
            },
            "mva_techniques": {
                "options": ans['3.9 Select: MVA techniques'],
                "other":
                    ans['3.9 Select: MVA techniques other specifics']
            },
            "sample_mix": {
                "options": ans['3.10 Sample mix'],
                "other": ans['3.10 Sample mix specifics']
            },
            "overtraining": {
                "options": ans['3.11 Overtraining'],
                "comments": ans['3.11 Overtraining specifics']
            },
            "robustness_check": {
                "options": ans['3.12 Robustness check'],
                "other": ans['3.12 Robustness check specifics']
            }
        }

        # 4
        new_ans["data_fitting"] = {
            "analysis_fitting": ans['4.1 Analysis fitting'],
            "analysis_fitting_specifics":
                ans['4.2 Analysis fitting specifics'],
            "functional_forms": {
                "options": [
                    x.split('FF: ')[-1]
                    for x in ['4.3 FF: Histograms/Templates',
                              '4.3 FF: Parametric curves/pdfs',
                              '4.3 FF: Other']
                    if ans[x]
                ],
                "comments": ans['4.3 Functional forms: other specifics']
            },
            "fitting_model": {
                "options": [
                    x.split('FM: ')[-1]
                    for x in ['4.4 FM: Histograms/Templates from MC',
                              '4.4 FM: Histograms/Templates from a '
                              'data sideband',
                              '4.4 FM: Theory curve(s)',
                              '4.4 FM: Theory-inspired curve(s)',
                              '4.4 FM: Ad-hoc curves', '4.4 FM: Other']
                    if ans[x]
                ],
                "comments":
                    ans['4.4 Fitting model: comments']
            },
            "stats": {
                "options": [
                    x.split('Stats: ')[-1]
                    for x in ['4.5 Stats: Chi-square',
                              '4.5 Stats: Binned likelihood',
                              '4.5 Stats: Unbinned likelihood',
                              '4.5 Stats: Other']
                    if ans[x]
                ],
                "comments":
                    ans['4.5 Stats: others specifics'],
                "other":
                    ans['4.5.1 Stats: others specifics more']
            },
            "gof": {
                "use_options": ans['4.6 GOF'],
                "comments": ans['4.6 GOF other specifics'],
                "p_values": [
                    x.split('GOF: ')[-1]
                    for x in ["4.6 GOF: Don't know", '4.6 GOF: <0.1%',
                              '4.6 GOF: 0.1%-1%', '4.6 GOF: 1%-5%',
                              '4.6 GOF: 5%-99%', '4.6 GOF: 99%-99.9%',
                              '4.6 GOF: >99.9%']
                    if ans[x]
                ]
            },
            "pd_check": {
                "options": ans['4.7 check it'],
                "comments": ans['4.7 additional comments']
            },
            "covariance_matrix": {
                "options": ans['4.8 cov matrix'],
                "comments": ans['4.8 cov matrix additional']
            },
            "func_form": {
                "options": ans['4.9 func form'],
                "comments": ans['4.9 func form additional']
            },
            "nop": {
                "options": ans['4.10 number of parameters'],
                "comments": ans['4.10 number of parameters additional']
            },
            "close_physical_boundaries": {
                "options": ans['4.11 select'],
                "comments": ans['4.11 additional']
            }
        }

        # 5
        new_ans["confidence_intervals_limits"] = {
            "limits_on_parameters": ans['5.1 limits on parameters'],
            "two_sided_select": {
                "options": ans['5.2 select'],
                "comments": ans['5.2 additional']
            },
            "aware_agreement_cms_atlas": ans['5.3 agreement cms atlas'],
            "aware_sc_support": ans['5.4 sc support'],
            "aware_bayesian": ans['5.5 byesian'],
            "bayesian_approaches": {
                "options": [
                    x.split('BA: ')[-1]
                    for x in ['5.6 BA: Frequentist limits',
                              '5.6 BA: Frequentist intervals',
                              '5.6 BA: Modified frequentist limits (CLs)',
                              '5.6 BA: Profile likelihood limits',
                              '5.6 BA: Profile likelihood intervals',
                              '5.6 BA: Unified approach (Feldman-Cousins)',
                              '5.6 BA: Bayesian limits/intervals, with a '
                              'flat priori for the parameter of interest',
                              '5.6 BA: Bayesian limits/intervals, with a '
                              'reference prior for the parameter of interest',
                              '5.6 BA: Other']
                    if ans[x]
                ],
                "comments": ans['5.6 comments']
            },
            "confidence_interval_tools": {
                "options": [
                    x.split('CI: ')[-1]
                    for x in ['5.7 CI: The CMS Higgs Combination '
                              'Tool ("combine")',
                              '5.7 CI: LandS',
                              '5.7 CI: RooStats (by hand)',
                              '5.7 CI: Theta', '5.7 CI: Other']
                    if ans[x]
                ],
                "comments": ans['5.7 comments']
            },
            "frequentist_stats": {
                "options": ans['5.8 select'],
                "other": ans['5.8.1 other'],
                "comments": ans['5.8 comments']
            },
            "asymptotic_formulae": {
                "options": ans['5.9 select'],
                "cross_check": ans['5.9.1 cross check']
            },
            "toy_data": {
                "options": ans['5.10 select'],
                "comments": ans['5.10 comments']
            },
            "limit_conversion": {
                "options": ans['5.11 select'],
                "comments": ans['5.11 comments']
            }
        }

        # 6
        new_ans["discovery"] = {
            "discovery_twiki": ans['6.1 select'],
            "discovery_related_statements": ans['6.2 p-vals'],
            "test_statistic": {
                "options": ans['6.3 select'],
                "comments": ans['6.3 other']
            },
            "look_elsewhere_effect": {
                "options": ans['6.4 select'],
                "comments": ans['6.4 other']
            }
        }

        # 7
        new_ans["unfolding"] = {
            "is_used": ans['7.1 unfolding'],
            "twiki": ans['7.2 unfolding'],
            "correlation_neglect": ans['7.3 sc unfolding'],
            "techniques": {
                "options": ans['7.4 select'],
                "comments": ans['7.4 other']
            },
            "tools": {
                "options": ans['7.5 select'],
                "comments": ans['7.5 other']
            },
            "generalization": {
                "options": ans['7.6 select'],
                "comments": ans['7.6 other']
            },
            "response_matrix_condition": ans['7.7 resp matrix'],
            "parameter": ans['7.8 regularization on unfolding'],
            "validation": {
                "options": ans['7.9.1 experiments'],
                "comments": ans['7.9.2 checks'],
                "bottom_line_test": {
                    "options": ans['7.9.3 select'],
                    "comments": ans['7.9.3 other']
                }
            },
            "weights_applied": {
                "options": ans['7.10 select'],
                "comments": ans['7.10 other']
            },
            "public_info": {
                "histogram": ans['7.11.1 hist/cov matrix'],
                "response_matrix": ans['7.11.2 resp matrix'],
                "comments": ans['7.11 other']
            }
        }

        # 8
        new_ans["systematic_uncertainties"] = {
            "twiki": ans['8.1 sc recommendation twiki'],
            "statistic_uncertainties": ans['8.2 systematic uncertainties'],
            "systematic_effect": ans['8.3 systematic effect'],
            "cross_check": {
                "options": ans['8.4 select'],
                "uncertainty": ans['8.4.1 uncertainty'],
                "failure": ans['8.4.2 failure cross-check'],
                "comments": ans['8.4 comments']
            },
            "template_morphing": {
                "options": ans['8.5 select'],
                "comments": ans['8.5 other']
            }
        }

        # 9
        new_ans["parton_distribution_functions"] = {
            "pdf_uncertainty": {
                "options": ans['9.1 pdf uncertainty'],
                "comments": ans['9.1 pdf comments']
            },
            "sm": {
                "use": ans['9.2 select'],
                "options": ans['9.2.1 sensitivity'],
                "comments": ans['9.2 comments'],
                "hepdata": ans['9.2.2 hepdata']
            },
            "pdf": {
                "order": {
                    "options": ans['9.3.1 select'],
                    "comments": ans['9.3.1 comments']
                },
                "selection": {
                    "options": ans['9.3.2 select'],
                    "comments": ans['9.3.2 comments']
                },
                "citations": ans['9.3.3 pdf citation'],
                "uncertainty": ans['9.3.4 pdf uncertainty']
            }
        }

        # 10
        new_ans["other_stats"] = {
            "blind_analysis": {
                "options": ans['10.3 select'],
                "comments": ans['10.3 other']
            },
            "combined_measurements": {
                "options": ans['10.2 select'],
                "comments": ans['10.2 other']
            },
            "analysis_correlations": {
                "options": ans['10.1 select'],
                "comments": ans['10.1 other']
            }
        }

        # 11
        new_ans["comments_and_feedback"] = {
            "feedback_not_frozen": {
                "options": ans['11.1 select'],
                "comments": ans['11.1 other']
            },
            "comments": ans['11.2 additional comments'],
            "suggestions": ans['11.3 suggestions']
        }

        nested_answers.append(new_ans)
    return nested_answers


def remove_none_keys(d):
    clean = {}
    for k, v in d.items():
        if isinstance(v, dict):
            nested = remove_none_keys(v)
            if len(nested.keys()) > 0:
                clean[k] = nested
        elif (v is not None) and (v != []):
            clean[k] = v
    return clean
