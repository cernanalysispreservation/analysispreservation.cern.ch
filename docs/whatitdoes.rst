What it does
=====================================
.. |illustration| image::
CERN Analysis Preservation provide a centralised platform for physicists to describe, preserve, find, exchange information, and serves as a concrete effort to substantiate analyses reproducibility.

1. Capture

- Data model and metadata schema

The analysis data are modelled in JSON format that is conforming to certain JSON Schema to ensure the compliance of captured JSON snippets with standard metadata requirements. The platform draws inspiration from the Open Archival Information System (OAIS) recommended practices to ensure long-term preservation of captured assets.

Core components of a physics analysis and the metadata therein are identified to make comprehensive capture of analysis instances, and the flexibility of JSON format metadata schemata allows each collaboration and working group to tailor their input format according to experiments and working groups requirements.

Depending on the preference and work environment of the researcher, analysis information can be entered through a submission form on the web interface, or via the REST API.

-  Submission forms

Submission forms are designed to be unique to each collaboration. Taking into consideration the diversity of approach, workflow and language used for physics analyses within collaborations, the default analysis components and fields for description on the analysis forms are appropriate to collaboration requirements. Analysis groups within collaborations can further adjust the form to fit their respective workflow by duplicating or eliminating default component fields, and certain fields are conditional to the entered information on previous sections.

Visit the Glossary page for more information on the terminologies used on the forms.

-  REST API

-  Connectivity

-  Versioning
Each analysis page is identified with a unique

An Analyses record grows as the analysis proceed, and CAP keep track of each step of the way by assigning each stage of the analysis a unique persistent identifier

2. Search and retrieve

-  Search capability
The JSON snippets entered by user are stored in the Invenio digital repository database and sent to an Elasticsearch cluster that is being used for indexing and information retrieval needs.

-  Facets/ filter
Before, information about an analysis was scattered around many databases. With CAP users will be able to find an analysis with specific parameters, processed with a specific algorithm, or using a specific dataset or simulation (just to name a few examples). This opens ups new possibilities for internal collaboration.

3. Review and compare

-  Authorisation/ access control
-  Report compilation

4. Reproduce and reuse

-  Analysis environment preservation
-  Analysis take-over

5. Re-interpret

-  RECAST
