What it does
==================
And what it does not

CERN Analysis Preservation provide a centralised platform for physicists to describe, preserve, find, exchange information, and serves as a concrete effort to substantiate analyses reproducibility.

- Describe
Data model

Metadata
CERN SIS, together with preservation managers from the physics collaborations, identified the core components and their relationships of a physics analysis and the metadata therein, to make sure analysis instances can be captured comprehensively.
The metadata schemata in CAP are represent in JSON format, which provides the flexibility to allow each collaboration and working group to tailor their

Depending on the preference and work environment of the researcher, analysis information can be entered through a submission form on the web interface, or via the REST API, where input format can be tailored according to experiments and wor king groups requirements.



- Search and retrieve
The JSON snippets entered by user are stored in the Invenio digital repository database and sent to an Elasticsearch cluster that is being used for indexing and information retrieval needs.
Before, information about an analysis was scattered around many databases. With CAP users will be able to find an analysis with specific parameters, processed with a specific algorithm, or using a specific dataset or simulation (just to name a few examples). This opens ups new possibilities for internal collaboration.

- Review and compare



- Reuse and reproduce

- Re-interpret
