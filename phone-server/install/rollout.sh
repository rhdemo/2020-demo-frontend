#!/usr/bin/env bash
printf "\n\n######## phone-server rollout ########\n"

echo "Rolling out new version of phone-server"
oc rollout latest dc/phone-server
