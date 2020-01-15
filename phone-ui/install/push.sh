#!/usr/bin/env bash
printf "\n\n######## phone-ui push ########\n"

IMAGE_REPOSITORY=${PHONE_UI_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-phone-ui:latest}

echo "Pushing ${IMAGE_REPOSITORY}"
docker push ${IMAGE_REPOSITORY}



