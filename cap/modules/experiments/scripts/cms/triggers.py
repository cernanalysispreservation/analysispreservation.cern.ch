import json
import urllib2
import os

sources = {
    "2010": "http://fwyzard.web.cern.ch/fwyzard/hlt/2010/dataset",
    "2011": "http://fwyzard.web.cern.ch/fwyzard/hlt/2011/dataset",
    "2012": "http://fwyzard.web.cern.ch/fwyzard/hlt/2012/dataset",
    "2013": "http://fwyzard.web.cern.ch/fwyzard/hlt/2013/dataset"
}

triggers = dict()

for year in sources:
    year_list = dict()
    lines = []
    try:
        response = urllib2.urlopen(sources[year])
        html = response.read()
        for line in html.splitlines():
            col1, col2 = line.split()
            try:
                year_list[col1].append(col2)
            except:
                year_list[col1] = []
                year_list[col1].append(col2)
    except:
        print("ERROR: There was an error receiving the file")

    triggers[year] = year_list

full_filename = os.path.join(
    os.path.dirname(__file__),
    "../../static/jsonschemas/fields/cms_triggers.json"
)
with open(full_filename, 'w') as fp:
    json.dump(triggers, fp)
    # json.dump(triggers, fp, indent=4)
