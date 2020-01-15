#!/usr/bin/env bash
printf "\n\n######## phone-ui build ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

IMAGE_REPOSITORY=${PHONE_UI_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-phone-ui:latest}
SOURCE_REPOSITORY_URL=${SOURCE_REPOSITORY_URL:-git@github.com:rhdemo/2020-demo-frontend.git}
SOURCE_REPOSITORY_REF=${SOURCE_REPOSITORY_REF:-master}

echo "Building ${PHONE_UI_IMAGE_REPOSITORY}/phone-ui from ${SOURCE_REPOSITORY_URL} on ${SOURCE_REPOSITORY_REF}"

cd ${DIR}/..
rm -rf build
yarn install
yarn build

s2i build ./build centos/nginx-114-centos7 ${IMAGE_REPOSITORY}
