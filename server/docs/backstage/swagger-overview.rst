.. taken from https://github.com/Kjili/swagger-research

Swagger/OpenAPI Overview
========================

Swagger is a project for describing and documenting RESTful APIs.

At its core it is a specification - the OpenAPI (formerly Swagger) specification - a ``.yaml`` or ``.json`` file describing your API. To display this API description Swagger provides an interactive UI that reads the specification and offers the user the possibility to try out each API operation.

A wide range of modules exist to enable various interactions with and uses of the specification, e.g.:

- generate the specification from the code by adding certain annotations, most existing languages are supported
- generate template code from the specification to gain an extra layer of abstraction for the API frontend
- generate template test code
- integrate with and translate between different programming languages and formats for all the above

OpenAPI Specification
---------------------

The official GitHub repository for the specification can be found `here <https://github.com/OAI/OpenAPI-Specification>`_, its current version is `2.0 <https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md>`_ but not all modules support this version yet.

The specification can be generated from the code if certain cues are given. What you will need to do this depends on your programming language for the API and if you already have docstrings that can translate to a Swagger specification.
Automation is a good idea to keep your API documentation in sync with the code. If at some point you have to manually add some details or you want to understand the details of the specification I recommend reading `this tutorial <https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-1-introduction/>`_.

If you have a specification there is a huge variety of modules to achieve the above goals. It very much depends on your use case what you will need.

Swagger UI
----------

The official `Swagger UI <http://swagger.io/swagger-ui/>`_ has a live demo where you can try out specifications either by writing or importing them and see how they will look like. If you want to have a better idea of how your API documentation will look like, installing it yourself from the `GitHub repository <https://github.com/swagger-api/swagger-ui>`_ is easy.

Apart from the official one other implementations exist like an `Angular Swagger UI <https://libraries.io/bower/angular-swagger-ui>`_ and you can use a module to plug in the API documentation from the specification to your existing documentation e.g. a Sphinx-based one.

.. Angular Swagger UI Tutorial: http://phpflow.com/jquery-plugin-2/how-to-integrate-swagger-with-angular/

Integrating Swagger with Sphinx
-------------------------------

Up to this point integrating your API documentation with your Sphinx documentation will leave you with a rather plain, non-interactive representation that requires extra work for additional features like displaying (e.g. JSON schema) definitions.

I have had a look at a few well supported modules, two of which I will mention here:

`sphinxcontrib-openapi <https://github.com/ikalnytskyi/sphinxcontrib-openapi>`_:

- looks nice to me if using the readthedocs theme (see `this example <https://sphinxcontrib-openapi.readthedocs.io/#get--evidence-id>`_), does not show schemas etc.
- linking to specific operations is possible, operations cannot be folded to a list etc.
- reads specification from a local file per default
- both json and yaml work

`sphinx-swaggerdoc <https://github.com/unaguil/sphinx-swaggerdoc>`_:

- looks better to me than sphinxcontrib-openapi on alabaster theme but has some fields that show even if there is no information in the specification, does not show schemas etc.
- operations cannot be linked to, cannot be folded to a list etc.
- reads spec from a url per default, reading a file is possible with ``file://``
- only works with json, no yaml

Both are very easy to use. They simply require a ``pip install``, need to be added as extension to the ``conf.py`` and can be called with a single command that will generate the API documentation from a given specification.

I recommend looking at an example or trying them out to see if this is what you want and have a short look around to see if there is something new. If this is not what you want, the best possibility you have for now is to contribute to these projects to add features you miss, write your own code or use the Swagger UI and link to the API documentation from your Sphinx documentation. Unless you don't want to use Swagger after all and opt for one of the auto-documentation tools provided by Sphinx or `another API description language <https://en.wikipedia.org/wiki/Overview_of_RESTful_API_Description_Languages>`_.



.. Generates RESTful HTTP API reference documentation from a Flask application’s routing table:

.. https://pythonhosted.org/sphinxcontrib-httpdomain/#module-sphinxcontrib.autohttp.flask

.. https://pythonhosted.org/sphinxcontrib-httpdomain/#sphinxcontrib-autohttp-flask-exporting-api-reference-from-flask-app

.. with API Reference table:

.. https://pythonhosted.org/sphinxcontrib-httpdomain/#module-sphinxcontrib.autohttp.flaskqref

.. More generic: sphinx.ext.autodoc

.. sphinx-swagger:

.. - Generates a swagger API definition from above sphinxcontrib-httpdomain based documentation.
