#!/usr/bin/env bash
printf "\n\n######## dev ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ -d "${DIR}/tmp" ]; then
  echo "Found existing tmp directory"
else
  echo "Creating tmp directory"
  mkdir ${DIR}/tmp
fi

./common/infinispan/dev.sh

./admin-server/install/dev.sh 2>&1 > ${DIR}/tmp/admin-server.log &
pid[0]=$!

./phone-server/install/dev.sh 2>&1 > ${DIR}/tmp/phone-server.log &
pid[1]=$!

./admin-ui/install/dev.sh 2>&1 > ${DIR}/tmp/admin-ui.log &
pid[2]=$!

./phone-ui/install/dev.sh 2>&1 > ${DIR}/tmp/phone-ui.log &
pid[3]=$!


trap "kill ${pid[0]} ${pid[1]} ${pid[2]} ${pid[3]}; docker stop 2020-demo-infinispan; exit 1" INT
wait
