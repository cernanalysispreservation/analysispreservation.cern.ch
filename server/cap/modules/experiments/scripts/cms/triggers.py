## -*- coding: utf-8 -*-
##
## This file is part of CERN Analysis Preservation Framework.
## Copyright (C) 2016 CERN.
##
## CERN Analysis Preservation Framework is free software; you can redistribute
## it and/or modify it under the terms of the GNU General Public License as
## published by the Free Software Foundation; either version 2 of the
## License, or (at your option) any later version.
##
## CERN Analysis Preservation Framework is distributed in the hope that it will
## be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
## General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with CERN Analysis Preservation Framework; if not, write to the
## Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
## MA 02111-1307, USA.
##
## In applying this license, CERN does not
## waive the privileges and immunities granted to it by virtue of its status
## as an Intergovernmental Organization or submit itself to any jurisdiction.
#
#import json
#import os
#import urllib2
#
#sources = {
#    "2010": "http://fwyzard.web.cern.ch/fwyzard/hlt/2010/dataset",
#    "2011": "http://fwyzard.web.cern.ch/fwyzard/hlt/2011/dataset",
#    "2012": "http://fwyzard.web.cern.ch/fwyzard/hlt/2012/dataset",
#    "2013": "http://fwyzard.web.cern.ch/fwyzard/hlt/2013/dataset"
#}
#
#triggers = dict()
#
#for year in sources:
#    year_list = dict()
#    lines = []
#    try:
#        response = urllib2.urlopen(sources[year])
#        html = response.read()
#        for line in html.splitlines():
#            col1, col2 = line.split()
#            try:
#                year_list[col1].append(col2)
#            except:
#                year_list[col1] = []
#                year_list[col1].append(col2)
#    except:
#        print("ERROR: There was an error receiving the file")
#
#    triggers[year] = year_list
#
#full_filename = os.path.join(
#    os.path.dirname(__file__),
#    "../../static/jsonschemas/fields/cms_triggers.json"
#)
#with open(full_filename, 'w') as fp:
#    json.dump(triggers, fp)
#    # json.dump(triggers, fp, indent=4)
