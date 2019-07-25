#!/bin/bash

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then 
    ./scripts/helpers/check_commit_subject.sh -r  $TRAVIS_COMMIT_RANGE
fi