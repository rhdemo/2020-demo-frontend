#!/usr/bin/env bash
printf "\n\n######## phone-server dev ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

ENV_FILE=${DIR}/../../.env.dev
source ${ENV_FILE}
for ENV_VAR in $(sed 's/=.*//' ${ENV_FILE}); do export "${ENV_VAR}"; done

PHONE_SERVER_PORT=${PHONE_SERVER_PORT:-8081}
DATAGRID_HOST=${DATAGRID_HOST:-0.0.0.0}
DATAGRID_HOTROD_PORT=${DATAGRID_HOTROD_PORT:-11222}
SCORING_URL=${SCORING_URL:-http://localhost:8080}
DIGIT_RECOGNITION_URL=${DIGIT_RECOGNITION_URL:-http://localhost:8501}
CLUSTER_NAME=${CLUSTER_NAME:-Local Machine}

cd ${DIR}/..
pwd

npm install
PORT=${PHONE_SERVER_PORT} \
DATAGRID_HOST=${DATAGRID_HOST} \
DATAGRID_HOTROD_PORT=${DATAGRID_HOTROD_PORT} \
SCORING_URL=${SCORING_URL} \
DIGIT_RECOGNITION_URL=${DIGIT_RECOGNITION_URL} \
CLUSTER_NAME=${CLUSTER_NAME} \
npm run dev