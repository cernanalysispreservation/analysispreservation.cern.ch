.. _glossary:

Glossary
=========

Here is a list of terms we use regularly, so you get an idea of what they are:

.. glossary::

	Deposit
		A draft analysis decription on CERN Analysis Preservation.

	Docker/Docker Container
		An open source software that allows arbitrary software to be wrapped inside a so called "Docker container". This container mimics the environment the software usually runs in. Thus, it can be preserved and run relatively easy.

	Invenio-Deposit
		The part of the :doc:`Invenio <../community/related-projects>` framework that in case of CERN Analysis Preservation handles everything directly related to analysis records like permission to view and edit and storage.

	Kubernetes
		An open source software used by :doc:`REANA <../community/related-projects>` for managing containers (usually Docker containers) on a cluster. This includes scheduling and scaling tasks and executing the software wrapped inside the containers.

	UMBRELLA
		A container tool similar to Docker. It is designed as a light-weight tool for preserving an environment while considering hardware, operating system, software and data.

	Yadage Workflow
		A set of JSON schemas with rules how to chain them together to describe analysis workflows. They are wrapped in a container (e.g. Docker) and can be executed by Yadage both locally (e.g. on your laptop) and distributed (e.g. on Kubernetes or :doc:`REANA <../community/related-projects>`).

.. doc links, in case we want to include these:
.. Docker:			https://docs.docker.com/
.. Invenio-Deposit:	https://invenio-deposit.readthedocs.io/en/latest/
.. Kubernetes:		https://kubernetes.io/
.. Umbrella:		https://daspos.crc.nd.edu/images/reports/umbrella-vtdc15.pdf
.. Yadage:			https://yadage.readthedocs.io/en/latest/
