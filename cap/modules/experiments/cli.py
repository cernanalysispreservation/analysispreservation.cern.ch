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
"""CAP Cli."""
import os
import json

import click
from flask_cli import with_appcontext
from jsonschema.exceptions import ValidationError

from invenio_db import db

from cap.modules.deposit.api import CAPDeposit
from cap.modules.deposit.errors import DepositDoesNotExist, \
    DepositValidationError
from cap.modules.experiments.utils.cadi import synchronize_cadi_entries, \
    get_deposit_by_cadi_id
from cap.modules.experiments.utils.questionnaire import \
    extract_questionnaires_from_excel, remove_none_keys
from cap.modules.experiments.utils.cms import \
    cache_cms_triggers_in_es_from_file, extract_keywords_from_excel
from cap.modules.experiments.utils.das import \
    cache_das_datasets_in_es_from_file
from cap.modules.fixtures.cli import fixtures

from cap.modules.user.utils import get_existing_or_register_role


@fixtures.group()
def cms():
    """CMS fixtures."""
    pass


@cms.command('sync-cadi')
@click.option('--limit', '-n', type=int)
@with_appcontext
def sync_with_cadi_database(limit):
    """Add/update CADI entries connecting with CADI database."""
    synchronize_cadi_entries(limit)


@cms.command('index-datasets')
@click.option('--file', '-f', required=True, type=click.Path(exists=True))
@with_appcontext
def index_datasets(file):
    """Load datasets from file and index in ES."""
    with open(file, 'r') as fp:
        source = (dict(name=line.strip()) for line in fp)
        cache_das_datasets_in_es_from_file(source)

    click.secho("Datasets indexed in Elasticsearch.", fg='green')


@cms.command('index-triggers')
@click.option('--file', '-f', required=True, type=click.Path(exists=True))
@with_appcontext
def index_triggers(file):
    """Load cms triggers from json file and index in ES."""
    with open(file, 'r') as fp:
        source = (x for x in json.load(fp))
        cache_cms_triggers_in_es_from_file(source)

    click.secho("Triggers indexed in Elasticsearch.", fg='green')


@cms.command('keywords')
@click.option('--file', '-f', required=True, type=click.Path(exists=True))
@with_appcontext
def keywords(file):
    """Load CADI keywords and print not found IDs in a file."""
    data = extract_keywords_from_excel(file)
    not_found = []

    for item in data:
        cadi_id = item['cadi_id']
        del item['cadi_id']

        try:
            deposit = get_deposit_by_cadi_id(cadi_id)
            deposit['basic_info']['analysis_keywords'] = item

            deposit.commit()
            db.session.commit()
            click.secho(f"CADI ID {cadi_id} was successful.", fg='green')

        except DepositDoesNotExist:
            not_found.append(cadi_id)
            click.secho(f"CADI ID {cadi_id} not found.", fg='red')

        except DepositValidationError as e:
            errors = [err.res for err in e.errors]
            errors_str = ""
            try:
                errors_str = str(errors)
            except Exception:
                errors_str = "Can't tranform to string value"
            click.secho(f"CADI ID {cadi_id} - Validation Error on:", fg='red')
            click.secho(errors_str, fg='red')

    # write_path = os.path.join(os.getcwd(), 'not-found.txt')
    # with open(write_path, 'w') as out_file:
    #     out_file.writelines(
    #         f'{cadi_id}\n' for cadi_id in not_found
    #     )

    click.secho("Keywords extracted and saved.", fg='green')


def _questionnaire_data(data, title=None):
    return {
        '$ana_type': 'cms-stats-questionnaire',
        # 'general_title':
        #     title if title else
        #     f'{data.get("analysis_context").get("1.5 Title/References")}',
        '_user_edited': False,
        '_fetched_from': 'cmsstatisticscommitteequestionnaire.web.cern.ch',
        "analysis_context": data["analysis_context"],
        "general_information": data["general_information"],
        "multivariate_discriminants": data["multivariate_discriminants"],
        "data_fitting": data["data_fitting"],
        "confidence_intervals_limits": data["confidence_intervals_limits"],
        "discovery": data["discovery"],
        "unfolding": data["unfolding"],
        "systematic_uncertainties": data["systematic_uncertainties"],
        "parton_distribution_functions": data["parton_distribution_functions"],
        "other_stats": data["other_stats"],
        "comments_and_feedback": data["comments_and_feedback"]
    }


@cms.command('questions')
@click.option('--file', '-f', type=click.Path(exists=True), required=True)
@with_appcontext
def questionnaires(file):
    """Load and save CMS questionnaire data."""
    answers = extract_questionnaires_from_excel(file)
    click.secho(f"Total Answers: {len(answers)}", fg='green')

    for answer in answers:
        deposit = None
        with db.session.begin_nested():
            try:
                title = f"Statistics Questionnaire for " \
                        f"{answer['analysis_context']['cadi_id']}" \
                            if answer['analysis_context']['cadi_id'] \
                            else "--"
                extracted = remove_none_keys(
                    _questionnaire_data(answer, title=title))
                if title:
                    extracted["general_title"] = title
                deposit = CAPDeposit.create(data=extracted, owner=None)

                # give read access to members of CMS experiment
                deposit._add_experiment_permissions(
                    'CMS',
                    ['deposit-read'],
                )

                # give permission to stat committee
                admin_egroups = ["cms-statistics-committee@cern.ch"]
                for role in admin_egroups:
                    _role = get_existing_or_register_role(role)
                    deposit._add_egroup_permissions(
                        _role,
                        [
                            'deposit-read',
                            'deposit-update',
                            'deposit-admin',
                        ],
                        db.session,
                    )

                deposit.commit()
                click.secho(
                    f"Success: {answer['_general_info']['serial']} - "
                    f"{answer['_general_info']['user']}",
                    fg='green')
                click.secho(f"{title}", fg='yellow')

            except DepositValidationError as e:
                click.secho("---------------")
                click.secho(f"Validation Error", fg='red')
                for err in e.errors:
                    click.secho(f"{err.to_dict()}", fg='red')
                click.secho("---------------")
                pass
            except ValidationError:
                click.secho("---------------")
                click.secho(f"Validation Error", fg='red')
                click.secho("---------------")
                pass

        db.session.commit()
