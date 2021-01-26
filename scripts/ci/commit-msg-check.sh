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

handle_test_result(){
    EXIT_CODE=$1
    RESULT="$2"
    if [ $EXIT_CODE -eq 0 ]; then
        echo "Commit check was succesfull."
    else
        echo "Errors in commit message."
    fi

    # Print RESULT if not empty
    if [ -n "$RESULT" ] ; then
        echo "$RESULT"
    fi
}

run_git_check(){
    RESULT=$(gitlint --commits $GIT_ORIGIN..$GIT_LAST 2>&1)
    local exit_code=$?
    handle_test_result $exit_code "$RESULT"
    return $exit_code
}

pip install gitlint
run_git_check