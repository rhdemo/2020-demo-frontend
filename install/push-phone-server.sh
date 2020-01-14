#!/usr/bin/env bash
echo "######## $(basename "$(test -L "$0" && readlink "$0" || echo "$0")") ########"

IMAGE_REPOSITORY=${PHONE_SERVER_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-phone-server:latest}

echo "Pushing ${IMAGE_REPOSITORY}"
docker push ${IMAGE_REPOSITORY}
