#!/bin/bash

component=(
"alice"
"atlas"
"cms"
"lhcb"
"ui"
"access"
"deposit"
"devops"
"docker"
"docs"
"fixtures"
"global"
"records"
"schemas"
"scripts"
"search"
"services"
"tests"
"travis"
"workflows"
)

RED='\033[0;31m'
NC='\033[0m' # No Color

usage() { echo "Usage: $0 -r <commit_range>" 1>&2; exit 1; }

while getopts r: opt
 do
      case $opt in
          r) commit_range="${OPTARG}"
             ;;
      esac
done

if [ -z "$commit_range" ]
then
    usage
    exit 1
fi

commit_subject=$(git log --pretty="format:%s" ${commit_range})
echo "Checking commit messages for range:"
echo "$commit_range"

commit_msg_component_error() {
    echo -e "${RED}Error:${NC} \"$1\" "
    echo "Commit subject has to start with one of
the keywords from the list of supported components"
}

contains() {
    found=1
    for item in "${component[@]}"; do
        if [[ "$1" == "$item" ]]
        then
            found=0
            break
        fi
    done
    echo "${found}"
}

commit_error=0
while read -r line; do
    IFS=':' read -ra ADDR <<< "$line"
    if [ ${#ADDR[@]} -gt 1 ]
    then
        check_message=$(contains "${ADDR[0]}")
        if [ $check_message -eq 1 ]
        then  
            commit_msg_component_error "${line}"
            commit_error=1
        fi
    else
        commit_msg_component_error "${line}"
        commit_error=1
    fi

done <<< "$commit_subject"

[[ "$commit_error" -eq 1 ]] && \
echo -e "Choose from list below:\n" && \
echo -e "${component[@]}\n"
exit ${commit_error}
