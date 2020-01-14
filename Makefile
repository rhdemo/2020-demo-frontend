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
	./phone-server/install/dev.sh

.PHONY: dev-phone-ui
dev-phone-ui:
	./phone-ui/install/dev.sh

##################################

# BUILD - build images locally using s2i

.PHONY: build-phone-server
build-phone-server:
	./phone-server/install/build.sh

.PHONY: build-phone-ui
build-phone-ui:
	./phone-ui/install/build.sh

.PHONY: build-phone
build-phone: build-phone-server build-phone-ui

.PHONY: build
build: build-phone

##################################

# PUSH - push images to repository

.PHONY: push-phone-server
push-phone-server:
	./phone-server/install/push.sh

.PHONY: push-phone-ui
push-phone-ui:
	./phone-ui/install/push.sh

.PHONY: push-phone
push-phone: push-phone-server push-phone-ui

.PHONY: push
push: push-phone

##################################

# LOGIN - log in to OpenShift cluster to deploy/rollout/undeploy
# requires .env OC_ variables (e.g. OC, OC_URL, OC_USER, OC_PASSWORD)

.PHONY: login
login:
	./common/install/login.sh

##################################

# DEPLOY - deploy applications to an openshift cluster
# requires LOGIN prerequisites

.PHONY: deploy-common
deploy-common: login
	./common/install/deploy.sh

.PHONY: deploy-phone-server
deploy-phone-server:
	./phone-server/install/deploy.sh

.PHONY: deploy-phone-ui
deploy-phone-ui:
	./phone-ui/install/deploy.sh

.PHONY: deploy-phone
deploy-phone: deploy-phone-server deploy-phone-ui

.PHONY: deploy
deploy: deploy-common deploy-phone

##################################

# ROLLOUT - refresh existing deployment
# requires LOGIN prerequisites

.PHONY: rollout-phone-server
rollout-phone-server:
	./phone-server/install/rollout.sh

.PHONY: rollout-phone-ui
rollout-phone-ui:
	./phone-ui/install/rollout.sh

.PHONY: rollout-phone
rollout-phone: rollout-phone-server rollout-phone-ui

.PHONY: rollout
rollout: rollout-phone

##################################

# UNDEPLOY - remove deployed frontend deployment artifacts
# requires LOGIN prerequisites

.PHONY: undeploy-common
undeploy-common: login
	./common/install/undeploy.sh

.PHONY: undeploy-phone-server
undeploy-phone-server:
	./phone-server/install/undeploy.sh

.PHONY: undeploy-phone-ui
undeploy-phone-ui:
	./phone-ui/install/undeploy.sh

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