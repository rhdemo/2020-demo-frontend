#!/usr/bin/env bash

printf "\n\n######## Initializing Caches ########\n"

/opt/infinispan/bin/cli.sh -c "http://$(ip a | grep global | awk '{print$2}' | sed 's|/.*||'):11222" --file=/config/batch

printf "\n\n######## Cache Init Complete ########\n"
