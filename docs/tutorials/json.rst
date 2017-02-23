JSON and JSON Schema
====================

`JSON <http://json.org/>`_ is an open data format where data is represented as objects of key-value pairs. It is independent from any tools and programming languages, usually stored in ``.json`` text files and can be parsed and created to and from most programming languages and systems. Therefore it is an easy format to share and preserve data.

An example miniature JSON file::

    {
      "basic_info": {
        "analysis_name": "Z -> ee",
        "status": "0 - planned / open topic",
        "people_info": [
          {
            "name": "John Doe",
            "email": "john.doe@cern.ch"
          },
          {
            "name": "Jane Doe",
            "email": "jane.doe@cern.ch"
          }
        ]
      }
    }

The above definitions contain a name, status and an array of names and emails. Every ``{...}`` marks an object, ``[...]`` marks an array and strings are wrapped in ``"..."``. Other possible data types are numbers (e.g. ``1``, ``0.5``), booleans (``true``, ``false``) and ``null`` for an empty value.

JSON Schema
-----------

A JSON schema defines a structure and rules that apply to it. JSON data can be validated against a schema to check whether the data fits the pre-defined structure and requirements of the schema.

It can be compared with an empty form (just like the forms on CERN Analysis Preservation that are based on JSON schemas). The content that can be filled in the form will be represented by JSON.

An example schema against which the above JSON file is validated::

    {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "title": "Internal Title (not displayed)",
      "description": "Internal Description (not displayed)",
      "type": "object",
      "properties": {
        "basic_info": {
          "title": "Basic Information",
          "description": "Please provide meta-data information relevant for the analysis here.",
          "type": "object",
          "properties": {
            "analysis_name": {
              "title": "Analysis Name",
              "type": "string",
              "required": true
            },
            "status": {
            "title": "Status",
            "type": "string",
              "enum": [
                "0 - planned / open topic",
                "1 - in preparation",
                "2 - ANA note released",
                "3 - review committee",
                "4 - collaboration review",
                "5 -",
                "6 - CONF note published",
                "7 -",
                "8 - journal review",
                "9 - PAPER published",
                "x - other"
              ]
            },
            "people_info": {
              "title": "Proponents",
              "description": "Please provide information about the people involved in the analysis.",
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "title": "Name",
                    "type": "string"
                  },
                  "email": {
                    "title": "Email-Adress",
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    }

It defines the structure and data types JSON data needs to follow and use to validate against it and allows to add additional rules like required fields.
