export $(shell sed 's/=.*//' .env.default)

ENV_FILE := .env
ifneq ("$(wildcard $(ENV_FILE))","")
include ${ENV_FILE}
export $(shell sed 's/=.*//' ${ENV_FILE})
endif

##################################

# DEV - run apps locally for development

.PHONY: dev-phone-server
dev-phone-server:
	./install/dev-phone-server.sh

.PHONY: dev-phone-ui
dev-phone-ui:
	./install/dev-phone-ui.sh

##################################

# BUILD - build images locally using s2i

.PHONY: build-phone-server
build-phone-server:
	./install/build-phone-server.sh

.PHONY: build-phone-ui
build-phone-ui:
	./install/build-phone-ui.sh

.PHONY: build-phone
build-phone: build-phone-server build-phone-ui

.PHONY: build
build: build-phone

##################################

# PUSH - push images to repository

.PHONY: push-phone-server
push-phone-server:
	./install/push-phone-server.sh

.PHONY: push-phone-ui
push-phone-ui:
	./install/push-phone-ui.sh

.PHONY: push-phone
push-phone: push-phone-server push-phone-ui

.PHONY: push
push: push-phone

##################################

# LOGIN - log in to OpenShift cluster to deploy/rollout/undeploy
# requires .env OC_ variables (e.g. OC, OC_URL, OC_USER, OC_PASSWORD)

.PHONY: login
login:
	./install/login.sh

##################################

# DEPLOY - deploy applications to an openshift cluster
# requires LOGIN prerequisites

.PHONY: deploy-common
deploy-common: login
	./install/deploy-common.sh

.PHONY: deploy-phone-server
deploy-phone-server:
	./install/deploy-phone-server.sh

.PHONY: deploy-phone-ui
deploy-phone-ui:
	./install/deploy-phone-ui.sh

.PHONY: deploy-phone
deploy-phone: deploy-phone-server deploy-phone-ui

.PHONY: deploy
deploy: deploy-common deploy-phone

##################################

# ROLLOUT - refresh existing deployment
# requires LOGIN prerequisites

.PHONY: rollout-phone-server
rollout-phone-server:
	./install/rollout-phone-server.sh

.PHONY: rollout-phone-ui
rollout-phone-ui:
	./install/rollout-phone-ui.sh

.PHONY: rollout-phone
rollout-phone: rollout-phone-server rollout-phone-ui

.PHONY: rollout
rollout: rollout-phone

##################################

# UNDEPLOY - remove deployed frontend deployment artifacts
# requires LOGIN prerequisites

.PHONY: undeploy-common
undeploy-common: login
	./install/undeploy-common.sh

.PHONY: undeploy-phone-server
undeploy-phone-server:
	./install/undeploy-phone-server.sh

.PHONY: undeploy-phone-ui
undeploy-phone-ui:
	./install/undeploy-phone-ui.sh

.PHONY: undeploy-phone
undeploy-phone: undeploy-phone-server undeploy-phone-ui undeploy-common

.PHONY: undeploy
undeploy: undeploy-phone undeploy-common


##################################

# DELETE - delete frontend namespace
# requires LOGIN prerequisites

.PHONY: delete
delete:
	${OC} login ${OC_URL} -u ${OC_USER} -p ${OC_PASSWORD} --insecure-skip-tls-verify=true
	${OC} project ${PROJECT} 2> /dev/null && oc delete project ${PROJECT}