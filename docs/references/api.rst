API Reference
=============

.. todo::
	list functions/swagger

CERN Analysis Preservation offers a REST API to access the service independent from the web interface. If you want to automate specific tasks or create your own data interface, you can use the API to do so.

Aquiring an Access Token
------------------------

If you want to gain access to CERN Analysis Preservation from your console or any external means other than the web portal you will need an access token to authenticate with the portal. You can create multiple tokens for different services.

.. warning ::
	Your access token will allow you to use the service in the same way in which you may use it if you log in on the web portal. You will have the same permissions unless specified otherwise on creation of the token. This implies that anyone who has this token can log in as yourself to the service. Do not share your personal access token with anyone else, and only use it with HTTPS!

To get an access token, you will need to log in on the web portal and `create one <https://analysispreservation.cern.ch/app/account/settings/applications/tokens/new/>`_.

In this dialog, `scopes` lets you define permissions for the token which by default only includes read access to your drafts and records.

.. glossary::

	create
		Adds write access to your token.

	actions
		Adds permissions to perform additional actions like sharing and cloning a record to your token.

Clicking `create` will generate and show your personal token in the browser. Please copy it to a safe place on your computer, as it is not stored on the portal and you will not be able to retrieve the same token again in the future.

Accessing the API
-----------------

Access your drafts using your token in the following link:

::

	https://analysispreservation.cern.ch/api/deposits?access_token=TOKEN

and your shared records with the following link:

::

	https://analysispreservation.cern.ch/api/records?access_token=TOKEN.

Adding the ID of a specific record or deposit in the link will give you access to this particular one only:

::

	https://analysispreservation.cern.ch/api/deposits/<id>?access_token=TOKEN
	https://analysispreservation.cern.ch/api/records/<id>?access_token=TOKEN
