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

# The following is a text file that represents your custom dictionary; edit as necessary.
# Add words to it that you wish to ignore for the spell check.

dict="./scripts/cap.wordlist"
temp_dict=$(mktemp docs-dictionary-XXXXXX)
lang=en
extension=pws

# Prepares the dictionary from scratch in case new words were added since last time.
prepare_dictionary() {
    local_dict=$(find . -name "*.$extension" -exec ls {} \;)
    if [ -z "$local_dict" ]; then
        sort -u "$temp_dict" -o "$temp_dict"
        aspell --lang="$lang" create master ./"$temp_dict" < "$dict"
    else
        temp_file=$(mktemp temp_file-XXXXXX)
        for file in $local_dict; do
            cat "$file" >> "$temp_file"
        done
        cat "$dict" >> "$temp_file"
        sort -u "$temp_file" -o "$temp_file"
        aspell --lang="$lang" create master "$temp_dict" < "$temp_file"
        /bin/rm -f "$temp_file"
    fi
}

# Removes the temporary dictionary.
cleanup() {
    /bin/rm -f "$temp_dict"
}

# Clean up if script is interrupted or terminated.
trap "cleanup" EXIT

GIT_ORIGIN=$1
GIT_HEAD=$2
COMMIT_MESSAGES=$(git log --pretty=format:%B "$GIT_ORIGIN".."$GIT_HEAD" | grep -v 'Signed-off-by')

ASPELL=$(which aspell)
if [ $? -ne 0 ]; then
    echo "Aspell not installed - unable to check spelling. Installing now..." >&2
    sudo apt-get install aspell
    if [ $? -ne 0 ]; then
        echo "Could not install Aspell through apt-get. Trying brew..." >&2
        brew install aspell
        if [ $? -ne 0 ]; then
            echo "Could not install Aspell through brew. Exiting..." >&2
            exit
        fi
    fi
fi

# create the new dictionary
prepare_dictionary
WORDS=$(echo "$COMMIT_MESSAGES" | aspell --mode=email --add-email-quote='#' list --lang="$lang" --extra-dicts=./"$temp_dict" --ignore-case -a | sort -u)

if [ -n "$WORDS" ]; then
    printf "Possible spelling errors found in commit message:\n\e[0m\e[0;31m%s\n\e[0m\e[1;33m  Use git commit --amend to change the message.\e[0m\n\n" "$WORDS" >&2
    cleanup
    exit 1
else
    echo "No spelling errors found! Continuing..."
fi
