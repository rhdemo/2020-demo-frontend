#!/usr/bin/env bash
printf "\n\n######## dashboard-ui rollout ########\n"

echo "Rolling out new version of dashboard-ui"
oc rollout latest dc/dashboard-ui

