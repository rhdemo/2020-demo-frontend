#!/usr/bin/env bash
printf "\n\n######## phone-server dev ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

ENV_FILE=${DIR}/../../.env.dev
source ${ENV_FILE}
for ENV_VAR in $(sed 's/=.*//' ${ENV_FILE}); do export "${ENV_VAR}"; done

PHONE_SERVER_PORT=${PHONE_SERVER_PORT:-8081}

cd ${DIR}/..
cd phone-server
pwd

npm install
PORT=${PHONE_SERVER_PORT} npm run dev