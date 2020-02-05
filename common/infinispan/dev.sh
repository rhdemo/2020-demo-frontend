#!/usr/bin/env bash
printf "\n\n######## infinispan dev container run in background ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker run --name 2020-demo-infinispan -d --rm -v ${DIR}/config:/config:z -p 11222:11222 -e CONFIG_PATH="/config/server.yaml" infinispan/server:10.1.1.Final
while [ -z "$(docker logs 2020-demo-infinispan 2>&1 | grep 'Infinispan Server 10.1.1.Final started')" ]; do
    printf "Waiting for Infinispan\n"
    sleep 3
done
docker exec -it 2020-demo-infinispan /config/init.sh

trap "docker stop 2020-dev-infinispan" INT
wait