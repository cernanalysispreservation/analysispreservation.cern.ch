.. taken from https://github.com/Kjili/docs-in-a-nutshell

User Documentation Overview
===========================

(User) Documentation in a nutshell. This is just about the process of creating your docs, for help on initiating, planning and maintaining docs please refer to the `Sources`_.

User vs. Developer Documentation
--------------------------------

There are two types of documentation: user documentation and developer (process/contributor) documentation. A user documentation is written for different groups of users to enable them to use the product, e.g. normal users and system administrators. Developer documentation is written for developers and contributors to enable them to quickly understand and develop for the product and is usually a lot more technical than user documentation. A definition for technical writers is given `here <https://en.wikiversity.org/wiki/Technical_writing_Types_of_User_Documentation>`_. Usually, the two types of documentation are clearly separated from each other by two seperate websites or a top-level menu.

All of the following hints address user documentation, some can be applied to developer documentation as well.

On writing your docs
--------------------

- Raise motivation

  ..
  
    "levels -- key achievement milestones with clear rewards -- are more motivating than just, 'here you go... keep going.'" [3]_
    
    "While level one is about completing tasks -- the user is just trying to get something done correctly and safely--level two is about improving overall skill and knowledge. [...]
    For a software app, this could be general reminders and tips. For a programmer, this might be design patterns and best-practice idioms, etc." [3]_
    
    "The best way to keep someone on track is to do two things:
      1) Show them how far they've come
      2) Show them where they can go next" [3]_
    
  Enable users to "learn from it, not just refer to it". [3]_


- Use the README

  ..
  
    "Your first steps in documentation should go into your README. [...] It is also the first interaction that most users will have with your project. So having a solid README will serve your project well." [1]_
  
  Check out a `Template <https://www.writethedocs.org/guide/writing/beginners-guide-to-docs/#id1>`_.


- Project description

  ..
  
    "A lot of people will come to your docs trying to figure out what exactly your project is. [...] You should explain what your project does and why it exists. `Fabric <http://docs.fabfile.org/>`_ does a great job of this." [1]_
    
    "Show a telling example of what your project would normally be used for." [1]_


- Explain a project if it is new and draw the line between it and existing ones

  ..
  
    "If your product is new or significantly different from similar products, you'll need to include an explanation of how it differs from other products as well as instructions on how to get started." [2]_


- Documentation layout and "Getting Started"

  ..
  
    "If the manual is one they will consult only infrequently or to look up information, it should primarily take the form of a reference document. If it is something users will consult frequently in the beginning, the reference section should be accompanied by a 'Getting Started' section and instructions on the most common tasks the product will be used for." [2]_
    
    "Reference materials can include lists of options, troubleshooting tips, and frequently asked questions. Glossaries and indexes can be added near the end of the manual, although a list of frequently used terms can appear at the front." [2]_


- Describe procedures

  ..
  
    "Begin with an overview of the task, then describe what the user has to do and what result he or she should see." [2]_
  
  Accompany the task by a description to typical problems and solutions to them (inline troubleshooting and faq or the other way round).
  Wrap up tasks that belong to a specific context in categories and separate them to create a quick and easy read and re-read. [3]_


- Problem-solution approach and chunking

  ..
  
    "Identify specific problems the user will face, state them in the user guide, and then follow with instructions to solve them. If the problem is a complex one, break it down into smaller parts. List each part with the instructions on how to solve or cope with it, and then follow with each subsequent part in succession."  [2]_


- FAQ and Troubleshooting

  ..
  
    "there are always questions that get asked about your project, things that can’t be changed, etc. Document those, and keep it up to date. [...] `Tastypie <http://django-tastypie.readthedocs.io/en/latest/cookbook.html>`_ did a great job with this, with their 'Cookbook' concept." [1]_
    "It's shocking how valuable those 'Pitfalls' and 'Troubleshooting' sections are, and they obviously pulled them from the students who've been trying to do these things." [3]_


- Link project (and related projects), contribution

  ..
  
    "People like to browse the code sometimes. They might be interested in filing bugs against the code for issues they’ve found. Make it really easy for people who want to contribute back to the project in any way possible. [...] the `Python Guide <http://docs.python-guide.org>`_ does a good job with the link to the code portion." [1]_

  Document rules for how to contribute and write/format code and documentation so users can follow these, see for example `Open Comparison <http://opencomparison.readthedocs.io/en/latest/contributing.html>`_ (e.g. a style/contribution guide). [1]_


- Documentation style

  ..
  
    "The text should also be organized in a way that mimics the way users think" [2]_
    
  Determine tone and structure that fit to your user's needs and stick to them. A positive language increases motivation.
  
  `Wikipedia <https://en.wikipedia.org>`_ has a nice collection of `writing style <https://en.wikipedia.org/wiki/Writing_style>`_ practices I recommend reading.


- Stay precise

  Avoid adjectives, adverbs, intensifiers, transitions and connectors. Make sentences short and to the point. Add a quick guide.


- Jargon usage

  Avoid technical/special terms. Explain those that can't be avoided and provide background. Use clear and easy-to-understand language. [2]_


- Images

  Use consistent image sizes for all images added to the documentation and keep themes constant for what is shown in the images (e.g. do not use pictures of the same software with different color themes). [2]_ Reduce the storage size of your image as much as possible but take care not to use blurry or pixelated images. Scaled vector graphics (svg) are a great way to achieve this.


- Support

  ..
  
    "Document how to get help and interact with the community around a project. `Django <https://docs.djangoproject.com/en/1.8/faq/help/>`_ does a great job with this." [1]_


- License

  Choose a license for code, documentation and perhaps assets if not included in the other's and make it clear which license is used.


- Table of content (TOC)

  Use a TOC when the page gets longer than the TOC itself would be.


- Test

  Test the software before you describe what procedures. Document exactly what you tested. Do not document untested procedures. If possible, create software tests for what you documented.
  
  Test spelling and grammar. Do user tests.


Get inspiration here https://github.com/PharkMillups/beautiful-docs, from the `Sources`_ and maybe here http://docs.godotengine.org/en/stable/.

Tools
-----

`Sphinx <http://www.sphinx-doc.org/en/stable/>`_ is a nice tool for exporting documentation written in plain text files with markup languages like reStructuredText in which this document is written in. If you decide to use it along with reStructuredText, check out their `CheatSheet <http://thomas-cokelaer.info/tutorials/sphinx/rest_syntax.html>`_.

It comes with a `list of powerful extensions <https://sphinxext-survey.readthedocs.io/en/latest/>`_ and a large user base.

Sources
-------

Most of the above is either directly quoted (when wrapped in "quotation marks") or derived from the following sources:

.. [1] http://www.writethedocs.org/guide/writing/beginners-guide-to-docs/
.. [2] http://www.wikihow.com/Create-a-User-Manual (text on `Wikihow <http://www.wikihow.com>`_ is licensed under the `Creative Commons Attribution Non-Commercial Share-Alike v3.0 license <https://creativecommons.org/licenses/by-nc-sa/3.0/>`_)
.. [3] http://headrush.typepad.com/creating_passionate_users/2007/03/the_best_user_t.html (article by Kathy licensed under the `Creative Commons Attribution Non-Commercial Share-Alike v2.5 license <https://creativecommons.org/licenses/by-nc-sa/2.5/>`_)

Credit goes to the respective authors and projects.

License
-------

This content is licensed under the `Creative Commons Attribution Non-Commercial Share-Alike v4.0 license <https://creativecommons.org/licenses/by-nc-sa/4.0/>`_.
