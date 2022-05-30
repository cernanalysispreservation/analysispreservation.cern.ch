#!/bin/bash
#
# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2021 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.


# This script can be also run locally, to do both checks at once.
# sh prebuild.sh -> defaults origin..HEAD
# sh prebuild.sh (with provided env vars) -> uses the env vars as origin and HEAD

# sh prebuild.sh <origin> <HEAD> -> adds the arguments instead
# sh prebuild.sh <origin> -> adds the origin, uses default HEAD
if [ -z "$1" ]; then
    if [ -z "$GIT_ORIGIN" ]; then
        echo "No argument supplied for first commit. Using default (origin)."
        GIT_ORIGIN="origin"
    else
        echo "Git origin env var found: $GIT_ORIGIN"
    fi
else
    echo "Git origin provided by user: $1"
    GIT_ORIGIN=$1
fi

if [ -z "$2" ]; then
    if [ -z "$GIT_HEAD" ]; then
        echo "No argument supplied for last commit. Using default (HEAD)."
        GIT_HEAD="HEAD"
    else
        echo "Git HEAD env var found: $GIT_HEAD"
    fi
else
    echo "Git HEAD provided by user: $2"
    GIT_HEAD=$2
fi

COMMIT_MESSAGES=$(git log --pretty=format:%B "$GIT_ORIGIN".."$GIT_HEAD")
# exit when any command fails
set -e

echo
echo "* Commit messages to be checked:"
echo "--------------------------------"
echo "$COMMIT_MESSAGES"
echo "--------------------------------"

# 1st step: commit message rules
echo
echo "* RUNNING: commit message rule checks..."
sh ./scripts/ci/commit-msg-check.sh "$GIT_ORIGIN" "$GIT_HEAD"

# 2nd step: check for typos
echo
echo "* RUNNING: commit message spelling checks..."
sh ./scripts/ci/commit-msg-spellcheck.sh "$GIT_ORIGIN" "$GIT_HEAD"
