Introduction
==================

**CERN Analysis Preservation** (CAP) is a service to describe, capture and reuse analysis information in HEP (High Energy Physics).
It is developed by the collaborative effort of information and computer scientists at CERN, in partnership with the LHC collaborations. An early-access version is available to the latter.

Reproducible and Reusable Research
---------------------------------

The initial idea behind the project was to preserve analyses for the purpose of reproducible research, making it accessible, understandable and reusable in many years to come. In conversations with LHC physicists, it became apparent that the information we collect will be valuable not only in the future, but already from the very start of information taking.

.. _introduction-analysis:

Analysis Definition
---------------------------------

To us, an analysis consists of both data (e.g. datasets, code, results) and metadata (e.g. analysis name, contact persons, publication) the combination of which we call analysis information. While we structure this information on CAP in a way that represents the analysis workflow steps, we do not require or ask for any change in the physicists' individual workflow or the terminologies used in different collaborations and working groups.
To accommodate for any changes in content and workflow of an analysis, we keep versions of both the analysis record itself and the underlying JSON schema (for more information see the tutorial on :doc:`JSON and JSON Schema <../tutorials/json>`).

Access Control
---------------------------------

As we are preserving sensitive data, we take care to apply safety measures and access control to any information added to CAP. Access will always be restricted to members of the collaboration associated with the analysis. Permissions within a collaboration can be adjusted by the creator of the analysis, defaulting to creator-only access. For more information please refer to our section on :ref:`project-access`.

