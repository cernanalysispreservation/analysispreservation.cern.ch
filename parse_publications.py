import cPickle
import json
import os
import sys
from os import path


def parse_ana_info():
    manager_location = current_app.config.get('PUBLICATIONS_MANAGER_LOCATION', '')
    file_location = current_app.config.get('PUBLICATIONS_FILE_LOCATION', '')
    results = {}

    root_path = path.abspath(path.dirname(__file__))
    sys.path.append(path.join(root_path, manager_location))
    os.chdir(file_location)

    manager = cPickle.load(open('publications.cpickle'), 'r'))
    analyses = manager.analyses.analyses

    for ana in analyses:
        key = ana.title
        results[key] = {}
        if hasattr(ana, 'egroup'):
            results[key]['egroup'] = ana.egroup
        if hasattr(ana, 'Twiki'):
            results[key]['twiki'] = ana.Twiki
        if hasattr(ana, 'reviewegroup'):
            results[key]['reviewegroup'] = ana.reviewegroup
        if hasattr(ana, 'measurement'):
            results[key]['measurement'] = ana.measurement
        if hasattr(ana, 'status'):
            results[key]['status'] = ana.status
        if hasattr(ana, 'arxiv'):
            results[key]['arxiv'] = ana.arxiv
        if hasattr(ana, 'paper'):
            results[key]['paper'] = ana.paper
        if hasattr(ana, 'normalised_WG'):
            results[key]['wg'] = ana.normalised_WG

        # another entry by ANANOTE (titles may differs within DBs)
        if ana.ANA:
            ananotes = ana.ANA.split(', ')
            for ananote in ananotes:
                results[ananote] = results[key]

    with open('publications.json', 'w') as fp:
        json.dump(results, fp, ensure_ascii=False)
