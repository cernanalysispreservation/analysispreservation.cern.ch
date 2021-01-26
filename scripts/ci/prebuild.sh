#!/bin/bash

echo "RUNNING PREBUILD SCRIPTS"
# if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then 
#     ./scripts/helpers/check_commit_subject.sh -r  $TRAVIS_COMMIT_RANGE
# fi

handle_test_result(){
    EXIT_CODE=$1
    RESULT="$2"
    # Change color to red or green depending on SUCCESS
    if [ $EXIT_CODE -eq 0 ]; then
        echo "${GREEN}SUCCESS"
        python setup.py test
    else
        echo "${RED}FAILURE"
    fi
    # Print RESULT if not empty
    if [ -n "$RESULT" ] ; then
        echo "\n$RESULT"
    fi
    # Reset color
    echo "${NO_COLOR}"
}

run_git_check(){
    echo "Running gitlint...${RED}"
    RESULT=$(gitlint --commits "origin...HEAD" 2>&1)
    local exit_code=$?
    handle_test_result $exit_code "$RESULT"
    return $exit_code
}

pip install gitlint
run_git_check