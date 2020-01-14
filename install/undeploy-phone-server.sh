#!/bin/bash
echo "######## $(basename "$(test -L "$0" && readlink "$0" || echo "$0")") ########"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-rhdemo}
IMAGE_REPOSITORY=${PHONE_SERVER_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-phone-server:latest}

oc project ${PROJECT}
echo "Undeploying ${IMAGE_REPOSITORY}"

oc process -f ${DIR}/phone-server.yml | oc delete -f -
