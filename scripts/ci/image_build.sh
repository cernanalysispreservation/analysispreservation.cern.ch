#!/usr/bin/env bash

GITLAB_BRANCH=master
# URL to trigger the build of the Docker image
# Set the project id: you can find your trigger URL under "Pipeline Triggers" at Settings/CI-CD
# https://gitlab.cern.ch/<your-group>/<your-repo>/settings/ci_cd
GITLAB_PIPELINE_TRIGGER_URL=$trigger_uri
GITLAB_PIPELINE_TRIGGER_TOKEN=$token
ENVIRONMENTS='dev
qa'

IMAGES='ui
app'

usage() { echo "Usage: $0 [-b <branch> | -c <commit> | -t <tag> | -p <pull-request>] [-d <env>] [-i <image-name>]" 1>&2; exit 1; }

# Source code inside the Docker image will be cloned on a specific `branch` (default `master`), `commit`, `tag` or `pr`
git_ref_params=0
while getopts b:t:p:d:i: opt
 do
      case $opt in
          b) type='BRANCH_NAME'
             value="${OPTARG}"
             docker_image_version=$value
             git_ref_params=$(($git_ref_params+1))
             echo "Building image from branch $value"
             ;;
          c) type='COMMIT_ID'
             value="$OPTARG"
             docker_image_version=$value
             git_ref_params=$(($git_ref_params+1))
             echo "Building image from commit $value"
             ;;
          t) type='TAG_NAME'
             value="$OPTARG"
             docker_image_version=$value
             git_ref_params=$(($git_ref_params+1))
             echo "Building image from tag $value"
             ;;
          p) type='PR_ID'
             value="$OPTARG"
             docker_image_version="pr-$value"
             git_ref_params=$(($git_ref_params+1))
             echo "Building image from pull request $value"
             ;;
          d) deploy=1
             environment="$OPTARG"
             ;;
          i) APPLICATION_IMAGE_NAME="${OPTARG}"
             echo "Triggerring the build of ${OPTARG}"
             ;;
      esac
done

if [ "$git_ref_params" -gt 1 ]
then
    echo 'You can only pass one git ref parameter (-b|-c|-t|-p).'
    usage
    exit 1
elif [ "$git_ref_params" -eq 0 ]
then
    echo 'You did not select a git ref, do you want to build from master branch? "(Y or N)"'
    read answer
    # now check if $x is "y"
    if [ "$answer" = "y" ]
    then
        type='BRANCH_NAME'
        value='master'
        docker_image_version='latest'
        echo "Building image from branch $value"
    else
        usage
    fi
fi

if ! [ -z "$APPLICATION_IMAGE_NAME" ]
then
    if echo "$IMAGES" | grep -qE "^$APPLICATION_IMAGE_NAME$"
    then
        image_argument="-F variables[APPLICATION_IMAGE_NAME]=$APPLICATION_IMAGE_NAME"
    else
        echo "The provided image name ($APPLICATION_IMAGE_NAME) does not match the available names:\n$IMAGES"
        exit 1
    fi
else
    echo "Provided an image name ( -i <image-name> ). Available names:\n$IMAGES"
    exit 1
fi

if ! [ -z "$deploy" ]
then
    if echo "$ENVIRONMENTS" | grep -qE "^$environment$"
    then
        deploy_argument="-F variables[DEPLOY]=$environment"
    else
        echo -e "The provided environement ($environment) does not match the available environments:\n$ENVIRONMENTS"
        exit 1
    fi
fi

if ! [ -z "$enable_e2e" ]
then
    e2e_argument="-F variables[ENABLE_E2E]=$enable_e2e"
fi

# Trigger image build
curl -X POST $GITLAB_PIPELINE_TRIGGER_URL \
     -F token=$GITLAB_PIPELINE_TRIGGER_TOKEN \
     -F ref=$GITLAB_BRANCH \
     -F "variables[CACHE_DATE]=$(date +%Y-%m-%d:%H:%M:%S)" \
     -F "variables[${type}]=$value" \
     -F "variables[VERSION]=$docker_image_version" \
     $e2e_argument \
     $image_argument \
     $deploy_argument
