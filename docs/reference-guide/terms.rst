Terms, Acronyms and Related Projects
====================================

Here is a list of words we use regularly and related projects we may refer to, so you get an idea of what they are:

.. glossary::

	`CAP <https://analysispreservation.cern.ch/>`_
		An acronym for CERN Analysis Preservation. If you do not know what that is yet, take a look :doc:`here <../overview/introduction>`.

	`COD/CODP <http://opendata.cern.ch/>`_
		Acronyms for the CERN Open Data Portal. It is an open-access portal for CERN experiment data and software and serves as a learning platform as well as enabling further research and exploration.

	`DASPOS <http://daspos.org/>`_
		An acronym for Data and Software Preservation for Open Science. A project to explore preservation possibilities and techniques in high energy physics.

	Deposit
		We use this as synonym for the analysis form.

	Docker
		An open source software that allows arbitrary software to be wrapped inside a so called "Docker container". This container mimics the environment the software usually runs in. Thus, it can be preserved and run relatively easy.
	
	Docker Container
		see **Docker**
	
	`DPHEP <https://www.dphep.org/>`_
		An acronym for Data Preservation in High Energy Physics. A study group to explore preservation possibilities and techniques in high energy physics.

	`HEPData <https://www.hepdata.net/>`_
		An open-access portal preserving and providing data, plots and tables from publications in high energy physics.

	`Invenio <http://inveniosoftware.org/>`_
		An open source digital library framework developed at CERN that CERN Analysis Preservation is based on. It provides background functionality like authorization, working with analysis records and storage.

	Invenio-Deposit
		The part of the Invenio framework that in case of CERN Analysis Preservation handles everything directly related to analysis records like permission to view and edit and storage.

	Kubernetes
		An open source software used by REANA for managing containers (usually Docker containers) on a cluster. This includes scheduling and scaling tasks and executing the software wrapped inside the containers.

	`REANA <https://reana.readthedocs.io/en/latest/>`_
		An acronym for Reusable Analysis. A system that schedules and runs analyses on the CERN cloud based on Kubernetes and Yadage Workflows. It is used to rerun analyses from CERN Analysis Preservation and RECAST.

	REANA Hub
		see **REANA**

	`RECAST <http://recast.perimeterinstitute.ca/>`_
		A service based on requests to re-execute an analysis chain with the possibility of using a new signal model. Analysis chains are defined and stored as JSON workflows on CERN Analysis Preservation and rerun using REANA. An analysis is wrapped inside a Docker container.

	UMBRELLA
		A container tool similar to Docker. It is designed as a light-weight tool for preserving an environment while considering hardware, operating system, software and data.

	Yadage Workflow
		A set of JSON schemas with rules how to chain them together to describe analysis workflows. They are wrapped in a container (e.g. Docker) and can be executed by Yadage both locally (e.g. on your laptop) and distributed (e.g. on Kubernetes or REANA).

.. doc links, in case we want to include these:
.. CAP:				https://cernanalysispreservation.readthedocs.io/en/latest/
.. DASPOS:			http://daspos.org/
.. Docker:			https://docs.docker.com/
.. DPHEP:			https://www.dphep.org/
.. Invenio:			https://invenio.readthedocs.io/en/latest/
.. Invenio-Deposit:	https://invenio-deposit.readthedocs.io/en/latest/
.. Kubernetes:		https://kubernetes.io/
.. Reana:			https://reana.readthedocs.io/en/latest
.. Recast:			https://cds.cern.ch/record/1299950
.. Umbrella:		https://daspos.crc.nd.edu/images/reports/umbrella-vtdc15.pdf
.. Yadage:			https://yadage.readthedocs.io/en/latest/
