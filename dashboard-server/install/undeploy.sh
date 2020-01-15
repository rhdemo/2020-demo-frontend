#!/usr/bin/env bash
printf "\n\n######## dashboard-server undeploy ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-rhdemo}
IMAGE_REPOSITORY=${DASHBOARD_SERVER_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-dashboard-server:latest}

oc project ${PROJECT}
echo "Undeploying ${IMAGE_REPOSITORY}"

oc process -f ${DIR}/dashboard-server.yml | oc delete -f -
