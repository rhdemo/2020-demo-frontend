#!/usr/bin/env bash
printf "\n\n######## dashboard-ui undeploy ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-rhdemo}
IMAGE_REPOSITORY=${DASHBOARD_UI_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-dashboard-ui:latest}

oc project ${PROJECT}
echo "Deploying ${IMAGE_REPOSITORY}"

oc process -f ${DIR}/dashboard-ui.yml | oc delete -f -
