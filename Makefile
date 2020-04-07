ENV_FILE := .env
ifneq ("$(wildcard $(ENV_FILE))","")
include ${ENV_FILE}
export $(shell sed 's/=.*//' ${ENV_FILE})
endif

##################################

# DEV - run apps locally for development

.PHONY: dev-infinispan
dev-infinispan:
	./common/infinispan/dev.sh

.PHONY: dev-admin-edge
dev-admin-edge:
	./admin-edge/install/dev.sh

.PHONY: dev-bot-server
dev-bot-server:
	./bot-server/install/dev.sh

.PHONY: dev-phone-server
dev-phone-server:
	./phone-server/install/dev.sh

.PHONY: dev-phone-ui
dev-phone-ui:
	./phone-ui/install/dev.sh

.PHONY: dev
dev:
	./dev.sh

##################################

# BUILD - build images locally using s2i

.PHONY: build-admin-edge
build-admin-edge:
	./admin-edge/install/build.sh

.PHONY: build-bot-server
build-bot-server:
	./bot-server/install/build.sh

.PHONY: build-phone-server
build-phone-server:
	./phone-server/install/build.sh

.PHONY: build-phone-ui
build-phone-ui:
	./phone-ui/install/build.sh

.PHONY: build
build: build-admin-edge build-bot-server build-phone-server build-phone-ui

##################################

# PUSH - push images to repository

.PHONY: push-admin-edge
push-admin-edge:
	./admin-edge/install/push.sh

.PHONY: push-bot-server
push-bot-server:
	./bot-server/install/push.sh


.PHONY: push-phone-server
push-phone-server:
	./phone-server/install/push.sh

.PHONY: push-phone-ui
push-phone-ui:
	./phone-ui/install/push.sh

.PHONY: push
push: push-admin-edge push-bot-server push-phone-server push-phone-ui

##################################

