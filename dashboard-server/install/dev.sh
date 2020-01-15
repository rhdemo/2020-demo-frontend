#!/usr/bin/env bash
printf "\n\n######## dashboard-server dev ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

ENV_FILE=${DIR}/../../.env.dev
source ${ENV_FILE}
for ENV_VAR in $(sed 's/=.*//' ${ENV_FILE}); do export "${ENV_VAR}"; done

cd ${DIR}/..
cd dashboard-server
pwd

npm install
PORT=8081 npm run dev