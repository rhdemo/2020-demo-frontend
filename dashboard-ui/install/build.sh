#!/usr/bin/env bash
printf "\n\n######## dashboard-ui build ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

IMAGE_REPOSITORY=${DASHBOARD_UI_IMAGE_REPOSITORY:-quay.io/redhatdemo/2020-dashboard-ui:latest}
SOURCE_REPOSITORY_URL=${SOURCE_REPOSITORY_URL:-git@github.com:rhdemo/2020-demo-frontend.git}
SOURCE_REPOSITORY_REF=${SOURCE_REPOSITORY_REF:-master}

echo "Building ${IMAGE_REPOSITORY}/dashboard-ui from ${SOURCE_REPOSITORY_URL} on ${SOURCE_REPOSITORY_REF}"

s2i build ${SOURCE_REPOSITORY_URL} --ref ${SOURCE_REPOSITORY_REF} --context-dir /dashboard-ui/public centos/nginx-114-centos7 ${IMAGE_REPOSITORY}
