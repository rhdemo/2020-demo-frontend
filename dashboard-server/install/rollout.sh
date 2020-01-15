#!/usr/bin/env bash
printf "\n\n######## dashboard-server rollout ########\n"

echo "Rolling out new version of dashboard-server"
oc rollout latest dc/dashboard-server
