#!/usr/bin/env bash
printf "\n\n######## phone-server deploy ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-rhdemo}
IMAGE_REPOSITORY=${PHONE_SERVER_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-phone-server:latest}
REPLICAS=${PHONE_SERVER_REPLICAS:-1}

oc project ${PROJECT}
echo "Deploying ${IMAGE_REPOSITORY}"

oc process -f "${DIR}/phone-server.yml" \
  -p IMAGE_REPOSITORY=${IMAGE_REPOSITORY} \
  -p REPLICAS=${REPLICAS} \
  | oc create -f -
