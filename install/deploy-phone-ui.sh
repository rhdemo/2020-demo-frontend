#!/bin/bash
echo "######## $(basename "$(test -L "$0" && readlink "$0" || echo "$0")") ########"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-rhdemo}
ROUTE_NAME=${ROUTE_NAME:-game}
IMAGE_REPOSITORY=${PHONE_UI_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-phone-ui:latest}
REPLICAS=${PHONE_UI_REPLICAS:-1}

oc project ${PROJECT}
echo "Deploying ${IMAGE_REPOSITORY}"

oc process -f "${DIR}/phone-ui.yml" \
  -p IMAGE_REPOSITORY=${IMAGE_REPOSITORY} \
  -p REPLICAS=${REPLICAS} \
  -p ROUTE_NAME=${ROUTE_NAME} \
  -p KEY="${KEY}" \
  -p CERTIFICATE="${CERTIFICATE}" \
  -p CA_CERTIFICATE="${CA_CERTIFICATE}" \
  | oc create -f -
