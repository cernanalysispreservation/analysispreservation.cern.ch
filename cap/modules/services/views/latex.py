# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
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
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.
"""CAP Latex service."""

from flask import jsonify, request, abort
from . import blueprint
from cap.modules.access.utils import login_required
from cap.modules.services.serializers.latex import PathValidator

TEMPLATE = r"""
\usepackage{{tabularx}}

\begin{{tabularx}}{{ 10cm }}{{|X|}}
\hline

    \textbf{{{title}}} \\ \hline
    {joined_paths}
\hline
\end{{tabularx}}
"""

NEW_LINE = r""" \\ \hline
    """


def _latexify(paths, title):
    data, errors = PathValidator().load({'paths': paths})
    if errors != {}:
        abort(400, 'Dataset list contains invalid values. Aborting.')

    paths_fixed = [path.replace('_', r'\_') for path in paths]
    joined = NEW_LINE.join(paths_fixed) + NEW_LINE
    return TEMPLATE.format(title=title, joined_paths=joined)


@blueprint.route('/latex', methods=['POST'])
@login_required
def create_latex():
    try:
        data = request.get_json()
        paths = data.get('paths')
        title = data.get('title')

        latex = _latexify(paths, title)
        return jsonify({'latex': latex}), 200
    except AttributeError:
        abort(400, 'Missing data, please provide the list of dataset paths.')
