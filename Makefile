export $(shell sed 's/=.*//' .env.default)

ENV_FILE := .env
ifneq ("$(wildcard $(ENV_FILE))","")
include ${ENV_FILE}
export $(shell sed 's/=.*//' ${ENV_FILE})
endif

##################################

# DEV - run apps locally for development

.PHONY: dev-infinspan
dev-infinispan:
	./common/infinispan/dev.sh

.PHONY: dev-admin-server
dev-admin-server:
	./admin-server/install/dev.sh

.PHONY: dev-admin-ui
dev-admin-ui:
	./admin-ui/install/dev.sh

.PHONY: dev-phone-server
dev-phone-server:
	./phone-server/install/dev.sh

.PHONY: dev-phone-ui
dev-phone-ui:
	./phone-ui/install/dev.sh

.PHONY: dev-dashboard-server
dev-dashboard-server:
	./dashboard-server/install/dev.sh

.PHONY: dev-dashboard-ui
dev-dashboard-ui:
	./dashboard-ui/install/dev.sh

.PHONY: dev
dev:
	./dev.sh

##################################

# BUILD - build images locally using s2i

.PHONY: build-admin-server
build-admin-server:
	./admin-server/install/build.sh

.PHONY: build-admin-ui
build-admin-ui:
	./admin-ui/install/build.sh

.PHONY: build-phone-server
build-phone-server:
	./phone-server/install/build.sh

.PHONY: build-phone-ui
build-phone-ui:
	./phone-ui/install/build.sh

.PHONY: build-dashboard-server
build-dashboard-server:
	./dashboard-server/install/build.sh

.PHONY: build-dashboard-ui
build-dashboard-ui:
	./dashboard-ui/install/build.sh

.PHONY: build
build: build-admin-server build-admin-ui build-phone-server build-phone-ui build-dashboard-server build-dashboard-ui

##################################

# PUSH - push images to repository

.PHONY: push-admin-server
push-admin-server:
	./admin-server/install/push.sh

.PHONY: push-admin-ui
push-admin-ui:
	./admin-ui/install/push.sh
	
.PHONY: push-phone-server
push-phone-server:
	./phone-server/install/push.sh

.PHONY: push-phone-ui
push-phone-ui:
	./phone-ui/install/push.sh

.PHONY: push-dashboard-server
push-dashboard-server:
	./dashboard-server/install/push.sh

.PHONY: push-dashboard-ui
push-dashboard-ui:
	./dashboard-ui/install/push.sh

.PHONY: push
push: push-admin-server push-admin-ui push-phone-server push-phone-ui push-dashboard-server push-dashboard-ui

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

.PHONY: deploy-admin-server
deploy-admin-server: login
	./admin-server/install/deploy.sh

.PHONY: deploy-admin-ui
deploy-admin-ui: login
	./admin-ui/install/deploy.sh

.PHONY: deploy-phone-server
deploy-phone-server: login
	./phone-server/install/deploy.sh

.PHONY: deploy-phone-ui
deploy-phone-ui: login
	./phone-ui/install/deploy.sh

.PHONY: deploy-dashboard-server
deploy-dashboard-server: login
	./dashboard-server/install/deploy.sh

.PHONY: deploy-dashboard-ui
deploy-dashboard-ui: login
	./dashboard-ui/install/deploy.sh
	
.PHONY: deploy
deploy: login deploy-common deploy-admin-server deploy-admin-ui deploy-phone-server deploy-phone-ui deploy-dashboard-server deploy-dashboard-ui

##################################

# ROLLOUT - refresh existing deployment
# requires LOGIN prerequisites

.PHONY: rollout-admin-server
rollout-admin-server: login
	./admin-server/install/rollout.sh

.PHONY: rollout-admin-ui
rollout-admin-ui: login
	./admin-ui/install/rollout.sh

.PHONY: rollout-phone-server
rollout-phone-server: login
	./phone-server/install/rollout.sh

.PHONY: rollout-phone-ui
rollout-phone-ui: login
	./phone-ui/install/rollout.sh

.PHONY: rollout-dashboard-server
rollout-dashboard-server: login
	./dashboard-server/install/rollout.sh

.PHONY: rollout-dashboard-ui
rollout-dashboard-ui: login
	./dashboard-ui/install/rollout.sh

.PHONY: rollout
rollout: login rollout-admin-server rollout-admin-ui rollout-phone-server rollout-phone-ui rollout-dashboard-server rollout-dashboard-ui

##################################

# UNDEPLOY - remove deployed frontend deployment artifacts
# requires LOGIN prerequisites

.PHONY: undeploy-common
undeploy-common: login
	./common/install/undeploy.sh

.PHONY: undeploy-admin-server
undeploy-admin-server: login
	./admin-server/install/undeploy.sh

.PHONY: undeploy-admin-ui
undeploy-admin-ui: login
	./admin-ui/install/undeploy.sh

.PHONY: undeploy-phone-server
undeploy-phone-server: login
	./phone-server/install/undeploy.sh

.PHONY: undeploy-phone-ui
undeploy-phone-ui: login
	./phone-ui/install/undeploy.sh

.PHONY: undeploy-dashboard-server
undeploy-dashboard-server: login
	./dashboard-server/install/undeploy.sh

.PHONY: undeploy-dashboard-ui
undeploy-dashboard-ui: login
	./dashboard-ui/install/undeploy.sh

.PHONY: undeploy
undeploy: login undeploy-dashboard-ui undeploy-dashboard-server undeploy-phone-ui undeploy-phone-server undeploy-admin-ui undeploy-admin-server undeploy-common


##################################

# DELETE - delete frontend namespace
# requires LOGIN prerequisites

.PHONY: delete
delete:
	${OC} login ${OC_URL} -u ${OC_USER} -p ${OC_PASSWORD} --insecure-skip-tls-verify=true
	${OC} project ${PROJECT} 2> /dev/null && oc delete project ${PROJECT}