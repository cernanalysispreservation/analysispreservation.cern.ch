Style Guide
===========

This is a short style guide covering the essentials on how to write elements for this documentation.

Files
-----

We use `reStructuredText <https://en.wikipedia.org/wiki/ReStructuredText>`_ for our documentation. All files added should be lower-case only with a hyphen to separate words and the filename extension ``rst`` like this:

::

  example-file.rst

File names will appear in the browser address bar so names should be chosen carefully.

Titles
------

Main titles used at the top of each page are generated like this:

::

  Main Title
  ==========

Their names will appear in the table of contents thus each new file *must* have such a title and title names should be chosen carefully. Unless a specific name is given in the table of contents that replaces the title ``tocentry <filename>``.

Section titles are generated like this:

::

  Section Title
  -------------

Subsection titles are generated like this:

::

  Subsection Title
  ~~~~~~~~~~~~~~~~

Nested Lists
------------

Lists can be nested like this:

::

  1. enumerated list item

     - bullet list item

       a) numerals list item

  2. enumerated list item

     - bullet list item
     - bullet list item

It's important to add empty lines before and after each list.

Graphics
--------

Images included in the text should ideally be located in the ``_static`` folder at the root of the ``docs`` folder. If your document is in the root folder, you can include an image like this:

::

  .. image:: _static/image.png

Further Information
-------------------

Sphinx enhances reStructuredText in a lot of ways. It is worthwhile to check out their `CheatSheet <http://thomas-cokelaer.info/tutorials/sphinx/rest_syntax.html>`_ for more beautiful docs.
