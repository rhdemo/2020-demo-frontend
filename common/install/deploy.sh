#!/usr/bin/env bash
printf "\n\n######## common deploy ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-frontend}

oc project ${PROJECT}
echo "Deploying Common Objects"

oc process -f "${DIR}/common.yml" \
  | oc create -f -
