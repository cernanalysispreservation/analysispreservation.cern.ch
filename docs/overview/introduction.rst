Introduction
==================

**CERN Analysis Preservation** (CAP) is a service to describe, capture and reuse analysis information in HEP (High Energy Physics).
It is developed by the collaborative effort of information and computer scientists at CERN, in partnership with the four largest LHC collaborations. An early-access version is available to the latter.

Reproducible Research
---------------------

The initial idea behind the project was to preserve analyses for the purpose of reproducible research, making it accessible, understandable and reusable in many years to come. In conversations with LHC physicists it became apparent that the information we collect is valuable not only in years to come but already from the very start of information taking.

Collaborative Research
----------------------

Making analysis information accessible within the working group or collaboration opens up new possibilities for understanding, searching for and working with this information some of which are described in the :doc:`next section <project>`. The idea is to make collaborative research easier and increase the impact of preserved analyses.

.. _introduction-analysis:

Analysis Definition
-------------------

To us, an analysis consists of both data (e.g. datasets, code, results) and meta data (e.g. analysis name, contact persons, publication) the combination of which we call analysis information. While we structure this information on CAP in a way that represents the analysis workflow steps, we do not require or ask for any change in the physicists individual workflow or the terminologies used in different collaborations and working groups.
To accommodate for any changes in content and workflow of an analysis, we keep versions of both the analysis record itself and the underlying JSON schema (for more information see the tutorial on :doc:`JSON and JSON Schema <../tutorials/json>`).

Access Control
--------------

As we are preserving sensible data we take care to apply safety measures and access control to any information added to CAP. Access will always be restricted to members of the collaboration associated with the analysis. Permissions within a collaboration can be adjusted by the creator of the analysis, defaulting to creator-only access. For more information please refer to our section on :ref:`project-access`.

