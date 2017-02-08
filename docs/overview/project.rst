What It Does
=====================================

CERN Analysis Preservation provides a centralised platform for physicists to preserve, find and exchange information relevant for reproducibility of their analysis.

.. image:: ../_static/cernanalysispreservation_user_stories.png

- `1. Preserve`_
- `2. Search and Retrieve`_
- `3. Review and Compare`_
- `4. Reproduce and Rerun`_
- `5. Imagine...`_

1. Preserve
-----------

We try to make it as easy as possible for you to preserve analysis information so you will always know where to look for details and you (and others if they need to) will be able to understand and reproduce your research in years to come. To achieve this, we have implemented a web form, an API and connections to collaboration databases fetching as much information as possible automatically and offering multiple possibilities for adding the rest.

You will be able to start adding information at any time, be it at the very beginning of your analysis, after publication or some time in between.

This section will give you some background knowledge on how we save, describe and capture analysis information and who will be able to access it.

JSON Data Model and Metadata Schema
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The analysis information is modelled in the JSON format conforming to a specified JSON schema to ensure data is added in the structure and formatting predefined by collaboration physicists. If you want to know more about JSON, there is a tutorial on :doc:`JSON and JSON Schema <../tutorials/json>`. The platform draws inspiration from the Open Archival Information System (OAIS) recommended practices to ensure long-term preservation of captured assets.

Each schema is directly provided or created with support by collaboration physicists and tested as well as revised several times to ensure that important information will be preserved. Throughout this process core components of an analysis are identified and structured in a comprehensive way. Each collaboration has its own unique schema to capture the workflow that fits their requirements and a flexible design of the schema allows each working group to tailor their input according to their specific requirements. This will allow the existence of a fast diversity of analyses.
The flexibility provided allows to duplicate, delete, ignore and create content within the constraints of the schema some of which are conditional and will thus react to certain inputs in specific fields.

Every schema change is versioned, ensuring that the schema can be adapted to work with new requirements at any moment in time without breaking older analysis records.

Depending on the preference and work environment of the researcher, analysis information can be created and edited through a `Submission Form`_ on the web interface or via the `REST API`_.

Submission Form
~~~~~~~~~~~~~~~

Submission forms are the graphical representation of the JSON schemas described in the last section. They allow manual editing of each field as well as inserting JSON conforming to the JSON schema of this part of the analysis form. Auto-complete and auto-fill will support editing fields for which information exists in one of the connected databases. See the section on `Connectivity`_ for more information.
There are tutorials to help you :doc:`create an analysis <../tutorials/create>` using a submission form.

Visit the :doc:`glossary <../reference-guide/schema-reference>` for more information on the terminologies used in the form.

REST API
~~~~~~~~

There will be an API to enable direct content upload without using the submission form. A prototype will be available in the near future. If you want to track development you can check it `here <../status.html#capture>`_. A tutorial on using the API will be provided :doc:`here <../tutorials/create-api>` and a reference guide will be found :doc:`here <../reference-guide/api>`.

Connectivity
~~~~~~~~~~~~

To reduce user effort and ensure accuracy of added information, we are connecting to collaboration databases and systems containing analysis information. This allows us to auto-complete and auto-fill most of an analysis record as soon as it is created, given that the content exists in the databases we link to, as well as to keep the content updated and synchronized.

You can check the status of current connections `here <../status.html#capture>`_. For more details on how autofill works you can go to the tutorial for :doc:`creating an analysis <../tutorials/create>`.

Additionally, there is a possibility for uploading files (e.g. configuration files) as well as providing a URL from which the files are copied and stored automatically.

.. TODO link to file upload tutorial

Versioning
~~~~~~~~~~

Upon creation of an analysis on CAP it will be assigned a unique identifier. Every time the analysis is edited the new version will be stored as an update to the previous version of the analysis through the identifier system. This will enable references to intermediate analysis steps in the analysis notes, allow keeping track of the analysis and monitoring as well as undoing changes.

Authorisation/Access Control
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Authorization on CAP is managed by CERN Single Sign-On, therefore restricting login to CERN members and restricting collaboration access to the collaboration you a member of.

Due to the sensitive nature of research data and analysis information - especially in early stages of an analysis - accessibility of analysis information is subject to permissions set by the creator of an analysis and the researchers involved.

When starting a new analysis, the creator of the analysis draft record will be the only one able to view and edit the record. He can grant read or edit rights to researchers in the analysis team or working group.

As soon as the analysis is submitted, the analysis will be shared with the collaboration meaning its members will acquire rights to view the analysis. Editing rights will remain as they were for the draft.
A draft version can be submitted any time. There is no drawback in keeping a draft until the analysis is published other than that analysis content is hidden from members of your collaboration.

.. note::

	- only CERN members have access to CAP login
	- only collaboration members have access to a collaboration's area, can create analyses and can see shared analyses
	- only a certain collaboration's members have access to this collaborations analyses
	- only members granted specific rights can see or edit a draft version of an analysis
	- only the creator can see or edit an analysis with default permission settings

2. Search and Retrieve
----------------------

The search capability of CAP can help users find both archived and on-going analyses they have access to that contain the information specified in the search.

Search capability
~~~~~~~~~~~~~~~~~

Using the search bar at the top of the page or the dedicated search page that comes with it, users can search through their own and all shared analyses within their collaboration, past or on-going. Based on feedback by collaboration physicists filters will be created to enable search for specific content.

Additionally, users can easily keep track of and find analyses they created and those that are shared with them through a personal dashboard.

All analysis metadata are indexed, which means users can find analyses with specific parameters, processed with a specific algorithm, or using a specific dataset or simulation to name a few examples. Information that is not explicitly added to the schema and instead stored in an uploaded file are not indexed for search right now.

.. Facets/ filter
.. ~~~~~~~~~~~~~~

3. Review and compare
---------------------

CAP aims to simplify combining analysis as well as the process of analysis reviewing and approval by enabling the user to give specific access to analysis records and store relevant analysis information in one place.

Report Compilation
~~~~~~~~~~~~~~~~~~

Analysis information will be exportable from CAP to generate a status report or a framework for the analysis note.
CAP can also be a source of reference in analysis meetings.

4. Reproduce and Rerun
----------------------

In CAP analyses information is preserved with the aim of reproducible research. Rerunning an analysis is one aspect of this we are addressing through links to related projects like REANA and RECAST. For more on this please go to :doc:`related projects <related-projects>`.

.. Analysis Environment Preservation
.. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. Analysis Take-over
.. ~~~~~~~~~~~~~~~~~~

5. Imagine...
-------------

The above use cases were derived from input we received from CERN physicists. As much as these are still evolving and we allow them to change to make improvements there are ideas that go beyond these. Some ideas we are already aware of but have not yet found the time to evaluate them, others will keep arising as the service grows.

We are open to new ideas which is why all you can imagine to do with your analysis information that will help you with your research is part of what describes CAP.
