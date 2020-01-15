#!/usr/bin/env bash
printf "\n\n######## dashboard-ui push ########\n"

IMAGE_REPOSITORY=${DASHBOARD_UI_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-dashboard-ui:latest}

echo "Pushing ${IMAGE_REPOSITORY}"
docker push ${IMAGE_REPOSITORY}



