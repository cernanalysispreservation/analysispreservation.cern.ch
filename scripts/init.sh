#!/usr/bin/env sh
#
# -*- coding: utf-8 -*-
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
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.


# Creation of the database and tables.
cap db init
cap db create

# Creation of a default user.
cap users create info@inveniosoftware.org -a --password infoinfo

# Creation of ElasticSearch indices
cap index init

# Creation of collections (Invenio-Collections)
cap collections create CERNAnalysisPreservation
cap collections create CMS -p CERNAnalysisPreservation
cap collections create CMSQuestionnaire -p CMS
cap collections create CMSAnalysis -p CMS
cap collections create LHCb -p CERNAnalysisPreservation
cap collections create LHCbAnalysis -p LHCb
cap collections create ATLAS -p CERNAnalysisPreservation
cap collections create ATLASWorkflows -p ATLAS
cap collections create ALICE -p CERNAnalysisPreservation
