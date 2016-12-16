==============
 Contributing
==============

Any contribution, bug report, feature request and code contributions are
encouraged and welcome, so please go ahead and don't withhold feedback! 

Bug Reports and Feature Requests
================================

If you find a bug or have a feature request, please search for
`already reported problems
<https://github.com/cernanalysispreservation/analysis-preservation.cern.ch/issues>`_
before submitting a new issue. Also, remember to set labels to
indicate what you're filing an issue for.

If you would like to take a more active part in the CERN Analysis
Preservation developments, you can `watch ongoing discussions
<https://github.com/cernanalysispreservation/analysis-preservation.cern.ch/notifications>`_
and `become part of the team
<https://github.com/orgs/cernanalysispreservation/teams>`_.

Code Contributions
==================

We follow a typical `GitHub flow
<https://guides.github.com/introduction/flow/index.html>`_.

1. Fork this repository into your personal space.
2. Start a new topical branch for any contribution. Give it a
   descriptive name, say ``fix-CMS-schema-mappings``.
3. Create logically separate commits for logically separate things
   
   Remember, it is a lot easier to squash commits into one than it is
   to break them apart.
   If you are unsure what to do, mind the following based on the
   `official Invenio documentation 
   <https://invenio.readthedocs.io/en/latest/technology/git.html#r1-remarks-on-commit-history>`_:
   
   Split the commit
     * if the same commit addresses more than one logically separate
       problem
   Amend/squash the commit
     * if it breaks any tests or any functionality in it's current
       state (if you are not the primary author, use
       ``Co-Authored-By: name <name@example.com>`` in the commit
       message)
   Keep the commit
     * if it works as expected in it's current state
     * if you're not the primary author of this commit


4. Please add any ``(closes #123)`` directives in your pull request
   message, if it closes an open issue, as well as
   ``(references #123)``, if it does not close but address a part of
   the respective issue.
5. Test your branch on a local site and check the conformity of your
   commit messages with kwalitee, see the section on
   `Formating Commit Messages`_. You can also check out `this blog post 
   <http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html>`_
   on commit messages.
7. If everything works as expected, issue a pull request.
   If the branch is not quite ready yet, please indicate ``WIP``
   (=work in progress) in the pull request title.

For some general advice on using git, you might want to check out `this
style guide <https://github.com/agis-/git-style-guide>`_.

Formating Commit Messages
-------------------------

To check the conformity of your commit messages with kwalitee,
you will need to install it using ``pip install kwalitee``. Then you can
check your commit messages with ``kwalitee check message HEAD~3...``
to check the last three or ``kwalitee check message`` to check only
the last commit. You can also check a specific commit by attaching it's
hash to the latter command.

The format required by kwalitee follows the structure indicated below:

::

    KEYWORD: description in imperative (<=50 chars)

    * more detailed description that wraps after 72 chars and starts
      with two spaces in the next line

    * plus, there needs to be an empty line before every bullet point

    Signed-off-by YOURSELF

``KEYWORD`` needs to be one of
`these <https://github.com/cernanalysispreservation/analysis-preservation.cern.ch/blob/c4446015db6598a310b874371c8f5c62ba6f52ee/.kwalitee.yml>`_,
according to the type of change that you're introducing.

To create the ``Signed-off-by`` with your name and email as configured
with ``git config``, you can use `git commit -s` (see
https://help.github.com/articles/signing-commits-using-gpg/ for signing
commits with a gpg key, verifying it was you who created this commit).

For further reading, please refer to the `original repository on Github
<https://github.com/inveniosoftware/kwalitee>`_ and the `official
documentation <https://kwalitee.readthedocs.io/>`_.

Chatroom
========

Our chatroom is on `gitter
<https://gitter.im/cernanalysispreservation/analysis-preservation.cern.ch>`_,
it's open to everyone so feel free to join the conversation.
