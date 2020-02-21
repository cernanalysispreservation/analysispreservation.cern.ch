# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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
# or submit itself to any jurisdiction.

"""Integration tests for CAP api."""

from __future__ import absolute_import, print_function
import json

LATEX_RESULT = r"""
\usepackage{tabularx}

\begin{tabularx}{ 10cm }{|X|}
\hline

    \textbf{Primary Datasets} \\ \hline
    /Electron/Run2010B-PromptReco-v2/RECO \\ \hline
    /EG/Run2010A-Sep17ReReco\_v2/RECO \\ \hline
    /Photon/Run2010B-PromptReco-v2/RECO \\ \hline
    
\hline
\end{tabularx}
"""

def test_latex(app, auth_headers_for_superuser, json_headers):
    mock_data = {
        'paths': [
            '/Electron/Run2010B-PromptReco-v2/RECO',
            '/EG/Run2010A-Sep17ReReco_v2/RECO',
            '/Photon/Run2010B-PromptReco-v2/RECO'
        ],
        'title': 'Primary Datasets'
    }

    with app.test_client() as client:
        resp = client.post('services/latex',
                           headers=auth_headers_for_superuser + json_headers,
                           data=json.dumps(mock_data))

        assert resp.status_code == 200
        assert resp.json.get('latex') == LATEX_RESULT
