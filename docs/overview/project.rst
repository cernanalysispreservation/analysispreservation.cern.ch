Project Features
=====================================

CERN Analysis Preservation is a centralised platform for physicists to preserve and document information relevant to their analysis so that it remains understandable and reusable in the future.

.. image:: ../_static/cernanalysispreservation_user_stories.png

- :ref:`project-preserve`
- :ref:`project-search`
- :ref:`project-collaborate`
- :ref:`project-reuse`
- :ref:`project-imagine`


.. _project-preserve:

1. Preserve
---------------------------------

We try to make it as easy as possible for you to preserve your analysis information. To achieve this, we have implemented a web form and an API including a dedicated client, so that you can submit or update content from your shell. In addition, we have established connections to collaboration databases fetching as much information as possible automatically and offering different possibilities for adding the rest.

You will be able to start adding information at any time, be it at the very beginning of your analysis, in preparation for a conference, at the time of publication or at any time it is useful.

This section will give you some background knowledge on how we save, describe and capture analysis information and who is able to access it.

.. _project-submission-form:

Submission Form
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The submission forms are there to help you submit the different materials you create(d) while doing your analysis. They are a graphical representation of the JSON schemas. Information stored within connected databases is used to auto-complete and auto-fill the analysis description whenever possible. See the section on :ref:`project-connectivity` for more information.
There are tutorials to help you :doc:`create an analysis <../tutorials/create>` submitting your analysis details.
While we have taken steps to sure that the JSON schemas work for most people in a collaboration, we acknowledge that there may be differences in the way different people conduct an analysis. If you don't see that your analysis "matches" the schema provided, please get in touch with us. The forms also allow manual editing of each field, as well as the ability to input JSON directly.

.. _project-rest-api:


Submitting via the shell - Our "CAP-client"
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Using your shell, you can use the CAP-client to submit, update, retrieve an analysis and its components without the need to use the web forms. You can find details on how to install and use the client in http://cap-client-test.readthedocs.io/en/client-docs/#


REST API
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There is an API to enable direct interaction with the content, provided you have the right access permission. Help on using the API will be provided :doc:`here. <../references/api>`.



.. _project-connectivity:

Connections to other databases
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To save time when submitting and to ensure accuracy of added information, we are connecting to collaboration databases and systems containing analysis information. This allows us to auto-complete and auto-fill most of an analysis record as soon as it is created, given that the content exists in the databases. GitLab integration is also in place, so that you can automatically fetch analysis details, e.g. images, from there.

Additionally, we offer the possibility to uploading files (e.g. configuration files), as well as providing a URL, from which the files are copied and stored automatically.

For more details on how these integrations work, you can go to the tutorial for :doc:`creating an analysis <../tutorials/create>`.

.. TODO link to file upload tutorial

Versioning
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Upon creation of an analysis on CAP, a unique identifier is assigned. Every time the analysis is edited, the new version will be stored as an update to the previous version of the analysis through the identifier system. This will enable references to intermediate analysis steps in the analysis notes and allows keeping track of the analysis.


.. _project-access:

Authorisation and Access Control
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Authorization on CAP is managed by CERN Single Sign-On, therefore applying the usual access restrictions you are used to from your collaboration.

Due to the sensitive nature of analysis information and content - especially in early stages of an analysis - accessibility of analysis information is subject to permissions set by the collaborations, as well as the creator of an analysis and the collaborators involved.

When starting a new analysis submission to CAP, the analysis record is saved as a draft. By default, the creator of the draft record will be the only one able to view and edit it. Read or edit rights can be granted to researchers in the analysis team or the working group.

As soon as the analysis is "deposited", the analysis will be shared with the collaboration, meaning its members will acquire rights to view the analysis. Editing rights will remain as they were for the draft.
A draft version can be submitted any time. We encourage you to deposit the analysis as soon as possible so that it becomes "visible" to the  members of your collaboration (and no one else). However, these decisions are up to you and the collaboration's practices.

.. note::

	- only collaboration members have access to a collaboration's area, can create analyses and can see shared analyses
	- only a certain collaboration's members have access to this collaborations analyses
	- only members granted specific rights can see or edit a draft version of an analysis
	- only the creator can see or edit an analysis with default permission settings


.. _project-search:


2. Search and Retrieve
---------------------------------

The search capability of CAP can help users find both preserved and on-going analyses they have access to in CERN Analysis Preservation.

Search capability
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Using the search bar at the top of the page or the dedicated search page that comes with it, users can search through their own and all shared analyses within their collaboration, past or on-going. Filters (=facets) will help you select the relevant content.
All analysis metadata are indexed, which means users can find analyses with specific parameters, processed with a specific algorithm, or using a specific dataset or simulation to name a few examples. Information that is not explicitly added to the schema and instead stored in an uploaded file are not indexed for search right now.

.. note::
	You have suggestions on what is needed to make the search more useful to you? Please :doc:`let us know <../community/support>`!


.. _project-collaborate:

3. Review and compare
---------------------------------

CAP aims to support reviewing analyses and with that the process of analysis approval by enabling the user to give specific access to analysis records and store relevant analysis information in one place. If the collaboration decides so, relevant information could be exported easily to tools like Indico, for example. Exporting a record is liable to the same restrictions as accessing the record.


.. _project-reuse:

4. Reuse
---------------------------------

In CAP analyses information is preserved with the aim of reusing it - now or in the long term. We are working on making that easy as well! In the REANA project we build a framework to enable easy reinstantiation of an analysis. See :doc:`this list <../community/related-projects>` for a short description of these related projects.



.. _project-imagine:

5. Imagine...
---------------------------------

The above use cases were derived from input we received from CERN physicists. We are open to new ideas, which is why everything you want to do with your analysis information that will help you with your research is part of what describes CAP.
