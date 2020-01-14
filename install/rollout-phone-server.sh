#!/usr/bin/env bash
echo "######## $(basename "$(test -L "$0" && readlink "$0" || echo "$0")") ########"

echo "Rolling out new version of phone-server"
oc rollout latest dc/phone-server
