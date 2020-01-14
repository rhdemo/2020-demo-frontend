#!/bin/bash
echo "######## $(basename "$(test -L "$0" && readlink "$0" || echo "$0")") ########"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-rhdemo}

oc project ${PROJECT}
echo "Undeploying Common Objects"

oc process -f ${DIR}/common.yml | oc delete -f -
