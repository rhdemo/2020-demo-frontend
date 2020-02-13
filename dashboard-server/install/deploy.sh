#!/usr/bin/env bash
printf "\n\n######## dashboard-server deploy ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-frontend}
IMAGE_REPOSITORY=${DASHBOARD_SERVER_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-dashboard-server:latest}
REPLICAS=${DASHBOARD_SERVER_REPLICAS:-1}

oc project ${PROJECT}
echo "Deploying ${IMAGE_REPOSITORY}"

oc process -f "${DIR}/dashboard-server.yml" \
  -p IMAGE_REPOSITORY=${IMAGE_REPOSITORY} \
  -p REPLICAS=${REPLICAS} \
  | oc create -f -
