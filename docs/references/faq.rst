Frequently Asked Questions
===============================

.. glossary::

	Why should I be using CERN Analysis Preservation?
		We believe that your research is worth preserving. CAP is there to support you in making sure that the work and thoughts you have put into your analysis lasts beyond the lifetime of the analysis. By using CAP, you are able to safeguard your data, code, containers, etc., while you are working on something else or move on to the next project. Once submitted, you can easily search for other analyses (details) you might be interested in and, together with the REANA project, you will also be able to reinstantiate such analyses very easily. We know it is hard to document analyses, so we try to make it as easy as possible for you to submit and update content. 
		
	How do you define an "analysis"?
		A physics analysis usually contains numerous files, from data to code to containers and configuration files. Also, often there is a lot of "meta-information" that went into the analysis and that is needed to revisit and understand that analysis in the future. From our point of view, an analysis is a combination of data and metadata. However, it should be noted that we use the term "data" very loosley. While every analysis is different, there are many core components that are the same, which is apparent in the JSON schemas we provide. For more details, please see the :ref:`introduction-analysis`.

	Is the information or data I add openly accessible?
		No. Access to your analysis is always restricted to your collaboration and by the permissions you assign (see the section on :ref:`project-access` for more details). Nothing is open access on CERN Analysis Preservation (except for the projects' own source code). It is designed to be a safe environment for CERN physicists to use from the very beginning of starting their analysis and at any given moment in its lifetime. 
		
		If you are searching for a service providing open access data or you have some data to share, you may want to check out `http://opendata.cern.ch/ <CERN Open Data>`_.

	With all this rerunning, cloning and reusing, where is my work? Are you trying to automate analyses?
		No. An analysis is an extremely complex research work, which is precisely the reason why it is important to preserve it. After all, if it were easy to automate the process of an analysis, why store it? What we are trying to do is help you with repetitive tasks, help you find information you need, and support your review and approval process so that you can focus on the actual research.

	Do I have to use this rather long form or what other options do I have?
		You can use your shell and our "CAP-client" to submit, update or find an analysis. That way, you can fully circumvent the long submission form. Also, by using collaborative tools like GitLab, submitting your analysis becomes much easier and faster. You can automatically connect your repository to CAP, tag versions and update them. 
		
	What is the ID for the analysis?
		We use a unique ID for your analysis to distinguish it from the other analyses available on CAP. You can use it to update your analysis or find information about it via the CAP client. Once you submit your analysis, you will see it in the URL of your analysis page on CAP. 
		
	I have no idea what I am doing here, can you help me? 
		Sure, contact us via analysis-preservation-support@cern.ch. Additional support or feedback can also be given by the data preservation officers of the LHC collaborations. 
		
	
		



.. - As a database provider within LHC collab, how can I contribute to or profit from CAP

.. - Why do I have to enter information into internal databases AND here? - you dont have to; explain

.. - I can edit, can my collaborators edit my analysis too? - All your collaboration colleagues can read it, only those you invite specifically (personally or e-group) can edit as well

.. - Can I export the information for reviews/approvals? - yes
