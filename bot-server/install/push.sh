#!/usr/bin/env bash
printf "\n\n######## bot-server push ########\n"

IMAGE_REPOSITORY=${BOT_SERVER_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-bot-server:latest}

echo "Pushing ${IMAGE_REPOSITORY}"
docker push ${IMAGE_REPOSITORY}
