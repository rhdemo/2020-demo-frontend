#!/usr/bin/env bash
printf "\n\n######## dashboard-server push ########\n"

IMAGE_REPOSITORY=${DASHBOARD_SERVER_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-dashboard-server:latest}

echo "Pushing ${IMAGE_REPOSITORY}"
docker push ${IMAGE_REPOSITORY}
