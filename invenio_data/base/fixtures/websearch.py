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
# USA.

from fixture import DataSet

from invenio_search import fixtures as default


class CollectionData(DataSet):

    siteCollection = default.CollectionData.siteCollection

    class CMS(default.CollectionData.siteCollection):
        id = 2
        name = 'CMS'
        dbquery = '980:"CMS"'
        names = {('en', 'ln'): u'CMS Data Analyses',
                 ('fr', 'ln'): u'CMS Data Analyses'}

    class LHCb(default.CollectionData.siteCollection):
        id = 3
        name = 'LHCb'
        dbquery = '980:"LHCB"'
        names = {('en', 'ln'): u'LHCb Data Analyses',
                 ('fr', 'ln'): u'LHCb Data Analyses'}

    class ALICE(default.CollectionData.siteCollection):
        id = 4
        name = 'ALICE'
        dbquery = '980:"ALICE"'
        names = {('en', 'ln'): u'ALICE Data Analyses',
                 ('fr', 'ln'): u'ALICE Data Analyses'}

    class ATLAS(default.CollectionData.siteCollection):
        id = 5
        name = 'ATLAS'
        dbquery = '980:"ATLAS"'
        names = {('en', 'ln'): u'ATLAS Data Analyses',
                 ('fr', 'ln'): u'ATLAS Data Analyses'}

    class JSONTest(default.CollectionData.siteCollection):
        id = 6
        name = 'JSONTest'
        dbquery = '980:"JSONTest"'
        names = {('en', 'ln'): u'JSON Test Record',
                 ('fr', 'ln'): u'JSON Test Record'}


class CollectionCollectionData(DataSet):

    class siteCollection_JSONTest:
        dad = CollectionData.siteCollection
        son = CollectionData.JSONTest
        score = 10
        type = 'p'


__all__ = (
    'CollectionData',
    'CollectionCollectionData',
)
