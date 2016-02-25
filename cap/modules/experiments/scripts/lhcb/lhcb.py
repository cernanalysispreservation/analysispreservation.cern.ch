import shelve
import json


filename = "dbases/charm.shelve"
base_field = "analysis"

base = {}
title_list = []
tmp_title_list = []

s = shelve.open(filename)

# Get list of "title" for Anal.Name Autocomplete
title_list = s.get('analysis').keys()
for n in title_list:
    tmp_title_list.append({"value": n})

with open('../../static/jsonschemas/fields/lhcb_ana_titles.json', 'w') as fp:
    json.dump(tmp_title_list, fp)


def resolveObj(s, f, k):
    newk = {}
    for p in s[f][k]:
        if (hasattr(s[f][k][p], '__iter__')):
            newp = {}
            for l in s[f][k][p]:
                try:
                    newp[l] = s[p][l]
                except:
                    newk[p] = s[f][k][p]
                    # print("Warning", l)
                    break
            newk[p] = newp
        else:
            newk[p] = s[f][k][p]
    return newk


for k in s.get(base_field):
    base[k] = resolveObj(s,base_field, k)

with open('analyses_short.json', 'w') as fp:
    json.dump(s[base_field], fp)

with open('../../scripts/analyses.json', 'w') as fp:
    json.dump(base, fp)

# print json.dumps(base, indent=4, sort_keys=True)

s.close()
