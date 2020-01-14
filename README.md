# 2020-demo-frontend

For all settings, configure the variables in a .env folder, similar to the [.env.example](.env.example)

### DEV - run apps locally for development
`make dev-phone-server`

`make dev-phone-ui`

### BUILD - build images locally using s2i

`make build-phone-server`

`make build-phone-ui`

`make build-phone` ui + server

`make build` all frontend


### PUSH - push images to repository

`make push-phone-server`

`make push-phone-ui`

`make push-phone` ui + server

`make push` all frontend

### LOGIN - log in to OpenShift cluster to deploy/rollout/undeploy
requires `.env` OC_ variables (e.g. `OC`, `OC_URL`, `OC_USER`, `OC_PASSWORD`)
used in conjunction with deploy/rollout/undeploy
make login

### DEPLOY - deploy applications to an openshift cluster
requires LOGIN prerequisites

`make deploy-common`

`make deploy-phone-server`

`make deploy-phone-ui`

`make deploy-phone` ui + server

`make deploy` all frontend

### ROLLOUT - refresh existing deployment
requires LOGIN prerequisites

`make rollout-phone-server`

`make rollout-phone-ui`

`make rollout-phone` ui + server

`make rollout` all frontend

##################################

### UNDEPLOY - remove deployed frontend deployment artifacts
requires LOGIN prerequisites

`make undeploy-common`

`make undeploy-phone-server`

`make undeploy-phone-ui`

`make undeploy-phone` ui + server

`make undeploy` all frontend


### DELETE - delete frontend namespace
requires LOGIN prerequisites

`make delete` deletes the entire namespace