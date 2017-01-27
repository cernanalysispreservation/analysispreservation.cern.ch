Status Report
=============

.. note:: This page will be updated as development progresses. If you have any questions or something appears out of date please feel free to :doc:`contact us <support>`.

Development wraps around the three pillars identified with the help of CERN physicists in the `5th CAP meeting <https://github.com/cernanalysispreservation/analysis-preservation.cern.ch/wiki/Fifth-CAP-meeting>`_:

- `Describe`_
- `Capture`_
- `Rerun`_

To this point these can roughly be translated to *what you see*, *the functionality that lies behind it* and *additional services*.

Describe
--------

Experiment schemas are used to describe the most important features and data for an analysis. They will be accessible via web forms and an API. Thus, this pillar includes everything related to the *schemas*, *search*, *user interface* and *API*.

**Schemas - work in progress**
	**ALICE - information required**
		Pending, as no schema or information for creating a schema has been provided yet.
	**ATLAS - untested**
		Focus has been put on the workflow. A basic schema exists that will require testing and feedback.
	**CMS - iterative testing and development**
		Iterative testing has provided us with sufficient input to create a schema that covers basic analyses. More feedback is needed from groups that have further requirements.
		
		The CMS Questionnaire has been added and will undergo testing to ensure its quality.
	**LHCb - polishing state**
		Testing and refinement have let to an (almost) complete schema that will undergo full-functionality testing to ensure its quality.
**Search - being implemented**
	A dedicated search page is currently under development. We have gained some feedback pointing out interesting filters for adjusting the search to specific analysis information. More feedback is welcome.
**UI - in progress of updating**
	An update for the user interface is work in progress and will continue for some while. We will need testers to ensure the best user experience.
**API - basic version exists**
	A very basic version exists, future development will be driven by requirements named by physicists. This is one of the next tasks to come.

Capture
-------

Autocompletion, suggestion of content and automatic filling in of information will be handled by this pillar as well as save storage of information and data.

**ALICE - information required**
	Pending, as no information has been provided yet.
**ATLAS - access to databases required**
	Access to databases is not available to us yet, no connection possible.

	- Glance - no access
	- AMI - no access

**CMS - access lost, connections not established**
	Access to databases was lost due to API changes, more information is required on what else is needed or can be captured.

	- CADI - waiting for reimplementation
	- DAS - reconnection is work in progress
	- more - information required

**LHCb - mostly connected**
	A connection to most databases is established.

	- Bookkeeping (BK) - no connection yet, ...
	- Working Groups (WG) - connected
	- Publications - connected
	- Anna's DB - connected

**Data upload - almost ready**
	Uploading and saving files and data will be possible soon. Currently, last issues are resolved.

**Repository checkout - future work**
	Checking out the required state of a repository that is linked to in the analysis information is important for preservation. It will be a future task.

Rerun
-----

Rerunning an analysis with RECAST and without interfering in the way the analysis is done is possible right now. This pillar will provide the necessary wrap-around so you can rerun your analysis directly on CERN Analysis Preservation.

**ALICE - information required**
	Pending, as no information has been provided yet.
**ATLAS - examples refined for real analyses**
	A workflow schema exists and has already been refined for a real analysis. More examples are required.
**CMS - example workflow in development**
	Creating a first workflow schema for an analysis is currently work in progress.
**LHCb - examples exist for real analyses**
	A first workflow schema exists and has been developed for a real analysis. More examples are required.
