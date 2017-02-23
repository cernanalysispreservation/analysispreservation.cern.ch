Related Projects
================

.. todo::
	`RECAST <http://recast.perimeterinstitute.ca/>`_, `DASPOS <http://daspos.org/>`_ and `REANA <https://reana.readthedocs.io/en/latest/>`_ 

DASPOS
------

`DASPOS <http://daspos.org/>`_ explores (technical) measures that need to be taken in order to preserve HEP data with regard to understandability, trust and reusability. Ultimately, the concept should be applicable across disciplines.

One of the challenges DASPOS addresses is finding a commonality across disciplines for describing metadata.

..	REANA:
..	CAP is intended to be one client of REANA
..	runs jobs on the cloud using containers
..	works with EOS, only supports CERN architecture as of now
..	a yadage workflow is all that you need to be able to run your analysis on REANA
..	took technology from RECAST and transferred it to REANA
..	workflow execution

..	Recast:
..	CAP is one use case for RECAST: run analyses from CAP every month or so to see if any breaks due to external dependencies
..	reuse the background estimation and data but with a new signal model
..	result	=	f_analysis	(data | model)
..	Hepdata		CAP			pfHEP
..	CAP			DASPOS		OpenData
..	a use case for storing an analysis inside a container (effectively a use case for Yadage Workflows)
..	a signal region covered by an analysis has a good efficiency for my model -> Theorist would like to recast/rerun the analysis with a new signal model -> new interpretation of that measurement
..	Docker might not be around forever but you can always export Docker images in a tarball

