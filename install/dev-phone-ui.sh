#!/bin/bash
echo "######## $(basename "$(test -L "$0" && readlink "$0" || echo "$0")") ########"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

ENV_FILE=${DIR}/../../.env.dev
source ${ENV_FILE}
for ENV_VAR in $(sed 's/=.*//' ${ENV_FILE}); do export "${ENV_VAR}"; done

cd ${DIR}/..
cd phone-ui
pwd

yarn install
yarn start