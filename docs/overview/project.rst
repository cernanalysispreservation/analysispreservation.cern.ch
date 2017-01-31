What it does
=====================================

CERN Analysis Preservation provide a centralised platform for physicists to describe, preserve, find, exchange information, and serves as a concrete effort to substantiate analyses reproducibility.

.. image:: ../_static/cernanalysispreservation_user_stories.png

Capture
-------

TODO Short descrription

Data model and metadata schema
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The analysis data are modelled in JSON format that is conforming to certain JSON Schema to ensure the compliance of captured JSON snippets with standard metadata requirements. The platform draws inspiration from the Open Archival Information System (OAIS) recommended practices to ensure long-term preservation of captured assets.

Core components of a physics analysis and the metadata therein are identified to make comprehensive capture of analysis instances, and the flexibility of JSON format metadata schemata allows each collaboration and working group to tailor their input format according to experiments and working groups requirements.

Depending on the preference and work environment of the researcher, analysis information can be entered through a submission form on the web interface, or via the REST API.

Submission forms
~~~~~~~~~~~~~~~~

Submission forms are designed to be unique to each collaboration. Taking into consideration the diversity of approach, workflow and language used for physics analyses within collaborations, the default analysis components and fields for description on the analysis forms are appropriate to collaboration requirements. Analysis groups within collaborations can further adjust the form to fit their respective workflow by duplicating or eliminating default component fields, and certain fields are conditional to the entered information on previous sections.

Visit the Glossary page for more information on the terminologies used on the forms.

REST API
~~~~~~~~

Connectivity
~~~~~~~~~~~~

To reduce user effort and ensure accuracy of input information, CAP is working on connecting scattered analysis information databases and systems existing inside of collaborations, to enable auto-completion and auto-fill functions of the analysis form.

1. ATLAS

   - Glance
   - AMI

2. ALICE
3. CMS

   - CADI
   - DAS

4. LHCb

   - Bookkeeping (BK)
   - Publications
   - Working Groups (WG)

Versioning
~~~~~~~~~~

Upon creation on the CAP platform, each analysis will be persistently identified with a unique identifier, and each edit after will be recorded as an updated version of the analysis through the identifier system. This will enable references to intermediary analysis steps in the analysis notes, and keep track of the analyses each step of the way.

Search and Retrieve
-------------------

TODO Short descrription

Search capability
~~~~~~~~~~~~~~~~~

With the ever-present global search bar at the top of the screen, users can search through all shared analyses within their collaboration, past or on-going. From the "My Deposits" tab, users can easily sift through analyses they created and those they are involved in, i.e. when added to an analysis by collaborators.
*Note that permissions for "Analyses involved" are in accordance to the analysis setting.*

On CAP, all analysis metadata are indexed, which means users will be able to find an analysis with specific parameters, processed with a specific algorithm, or using a specific dataset or simulation (just to name a few examples). This opens ups new possibilities for internal collaboration.



Facets/ filter
~~~~~~~~~~~~~~

Review and compare
------------------

CAP aim to make the analysis review process easier with its flexible authorisation mechanism and strcutured way of presenting analysis details.


Authorisation/Access Control
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Due to the sensitive nature of the research data and analysis strategy - especially in the intial stage o f analyses - accessibility of analyses information on CAP is subjected to configurations set by the researchers involved. When starting a new analysis, the analysis form creator can grant read and edit rights to researchers in the analysis team if needed, and the form can be kept confidential to the analysis team until it contains sufficient descriptive information about the new analysis and can be shared with the collaboration.

Report Compilation
~~~~~~~~~~~~~~~~~~
Detailed analysis information can be exported from CAP, to generate status report.
In addition to the analysis meeting presentation slides, CAP can also be a robust source of reference on analysis meetings.

Reproduce and Reuse
-------------------



Analysis environment preservation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Analysis take-over
~~~~~~~~~~~~~~~~~~

RECAST
~~~~~~

REANA
~~~~~
