from flask import Flask
import os
from py2neo import Graph, Node, Relationship, authenticate

app = Flask(__name__)

url = os.environ.get('GRAPHENEDB_URL', 'http://datadependency.cern.ch:7474')
graph = Graph(url + '/db/data/')

#####
#  Method for getting a platform name from application name 
#####
def get_platform(app_name, app_version):
    query = """
    MATCH (n:Application{project:{app_name}, version: {app_version}})-[*..3]-(p:Platform) RETURN p.platform as platform LIMIT 5
    """
    return graph.cypher.execute(query, app_name=app_name, app_version=app_version)

#####
#  GET Reconstruction software: MC, real data
#  unknown input format
#####

#####
#  GET Stripping software: MC, real data
#  unknown input format
#####

#####
#  GET Year, real data
#  unknown input format 
#####

@app.route('/')
def hello_world():
    data = get_platform("GAUSS", "v45r1") #("DAVINCI", "v29r2p4") # "v33r8")
    beg = "<!DOCTYPE html><html><body><h1>Test</h1><table>"
    st = ""
    for line in data:
        st = st + "<tr><td>"+ line.platform + "</td></tr>"
    end = "</table><body></html>"
    return beg + st + end

if __name__ == '__main__':
    app.run(
		debug = True,
 		host = '0.0.0.0',
 		port = 80
                #ssl_context=context 

)
