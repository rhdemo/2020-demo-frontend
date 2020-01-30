#!/usr/bin/env bash
printf "\n\n######## dashboard-server dev ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

ENV_FILE=${DIR}/../../.env.dev
source ${ENV_FILE}
for ENV_VAR in $(sed 's/=.*//' ${ENV_FILE}); do export "${ENV_VAR}"; done

DASHBOARD_SERVER_PORT=${DASHBOARD_SERVER_PORT:-8083}

cd ${DIR}/..
cd dashboard-server
pwd

npm install
PORT=${DASHBOARD_SERVER_PORT} npm run dev

