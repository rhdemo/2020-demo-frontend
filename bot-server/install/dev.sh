#!/usr/bin/env bash
printf "\n\n######## bot-server dev ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

ENV_FILE=${DIR}/../../.env.dev
source ${ENV_FILE}
for ENV_VAR in $(sed 's/=.*//' ${ENV_FILE}); do export "${ENV_VAR}"; done

DATAGRID_HOST=${DATAGRID_HOST:-0.0.0.0}
DATAGRID_HOTROD_PORT=${DATAGRID_HOTROD_PORT:-11222}
CLUSTER_NAME=${CLUSTER_NAME:-Local Machine}
GAME_SOCKET=${GAME_SOCKET:-ws://0.0.0.0:8081}

cd ${DIR}/..
pwd

npm install
DATAGRID_HOST=${DATAGRID_HOST} \
DATAGRID_HOTROD_PORT=${DATAGRID_HOTROD_PORT} \
CLUSTER_NAME=${CLUSTER_NAME} \
GAME_SOCKET=${GAME_SOCKET} \
npm run dev