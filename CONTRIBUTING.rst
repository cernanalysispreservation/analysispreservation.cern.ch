==============
 Contributing
==============

Any contribution, bug report, feature request and code contributions are
encouraged and welcome, so please go ahead and don't withhold feedback!

- `Bug Reports and Feature Requests`_
- `Code Contributions`_

  - `Formating Commit Messages`_
  - `Change Propagation`_

- `Chatroom`_

Bug Reports and Feature Requests
================================

If you find a bug or have a feature request, please search for
`already reported problems
<https://github.com/cernanalysispreservation/analysispreservation.cern.ch/issues>`_
before submitting a new issue. Also, remember to set labels to
indicate what you're filing an issue for.

If you would like to take a more active part in the CERN Analysis
Preservation developments, you can `watch ongoing discussions
<https://github.com/cernanalysispreservation/analysispreservation.cern.ch/notifications>`_
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
   commit messages with `gitlint`, see the section on
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

CAP uses `Gitlint <https://jorisroovers.com/gitlint/>`_, a library written in Python,
that checks the commit messages for specified violations. You can install it through pip: ``pip install gitlint``.

Gitlint provides some out-of-the-box rules, found `here <https://jorisroovers.com/gitlint/rules/>`_,
but it also allows the user to create new rules in Python, for more specific purposes.

* The custom rules created for CAP can be found in ``gitlint_rules/rules.py``

* The out-of-the-box rules are in the gitlint settings file ``.gitlint``.

Most importantly, gitlints allows the user to create a ``pre-commit hook``, that checks the messages
before commiting, and enables them to make fixes in an interactive environment.
To enable this, after installing gitlint, simply use the command ``gitlint install-hook``
and gitlint will work everytime the user makes a commit in that specific repo.

Some useful commands:

* To check the last commit message: ``gitlint``

* To check all the commit messages, since the ``origin`` of the branch: ``gitlint --commits origin..HEAD``

* You can also specify the start and end of the checks, by using ``git log`` and
using the revision ids of the first and last commit you want to check, e.g. ``gitlint --commits a3808b47f99fbf79cb5f958e9a82a965935efc0b..9a502583d144bb835939318630f5169349b11a7e``


The format required by CAP follows the structure indicated below:

::

    KEYWORD: description in imperative (<=50 chars)

    * more detailed description that wraps after 72 chars

    Signed-off-by YOURSELF

``KEYWORD`` needs to be one of
`these <https://github.com/cernanalysispreservation/analysispreservation.cern.ch/blob/master/scripts/gitlint_rules/rules.py>`_,
according to the type of change that you're introducing.

To create the ``Signed-off-by`` with your name and email as configured
with ``git config``, you can use ``git commit -s`` (see
https://help.github.com/articles/signing-commits-using-gpg/ for signing
commits with a gpg key, verifying it was you who created this commit).

In case of an error, gitlint will also run in CI, and the checks will fail if the rules are not followed,
making sure that there is conformity in the commit messages.

Pre Commit Checks
-------------------------

CAP is using `pre-commit` framework for managing and maintaining pre-commit git hooks.

Currently, CAP supports the following pre-commit hooks:

1. Python Code Formating

   * Black
   * isort
   * flake8

2. JavaScript Code Formating
   
   * Prettier

3. Commit Message Formating
   
   * Gitlint
   * Spell check

Setup Instructions:

1. Install pre-commit: `pip install pre-commit`
2. Install the git hook script: `pre-commit install`
3. Install different hook types: `pre-commit install --hook-type pre-commit --hook-type pre-push --hook-type commit-msg`

`pre-commit` will now run on every commit. 


Change Propagation
------------------

Currently, CERN Analysis Preservation runs on three servers to allow
internal and external testing while keeping the service stable.

1. The `Production <https://analysispreservation.cern.ch>`_ server is
   the most stable version where data is savely stored and versioned.
   It receives rare updates to minimize the possibility of errors
   occuring and to maximize service up-time. This server is meant for
   long-term user testing and collaboration-wide access.
   It follows the `production branch
   <https://github.com/cernanalysispreservation/analysispreservation.cern.ch/tree/production>`_
   that receives updates from master after they were tested on the other
   two branches.
2. The `Quality Assurance <https://analysispreservation-qa.cern.ch>`_
   server is where we test new features with certain users. It receives
   more frequent updates and data may disappear after a while.
   It follows the `qa branch
   <https://github.com/cernanalysispreservation/analysispreservation.cern.ch/tree/qa>`_
   that receives updates from master after they were tested there.
3. The `Development <https://analysispreservation-dev.cern.ch>`_ server
   is unstable and exists for internal testing (nightly builds). Nothing
   is guaranteed to be preserved at any time, down-times are frequent
   and no warnings are given when deletion or changes occur.
   It follows the `master branch
   <https://github.com/cernanalysispreservation/analysispreservation.cern.ch>`_
   that receives updates from pull requests.

Chatroom
========

Our chatroom is on `gitter
<https://gitter.im/cernanalysispreservation/analysispreservation.cern.ch>`_,
it's open to everyone so feel free to join the conversation.
