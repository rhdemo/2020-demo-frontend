#!/usr/bin/env bash
#!/usr/bin/env bash
 phone-ui rollout ########\n"

echo "Rolling out new version of phone-ui"
oc rollout latest dc/phone-ui

