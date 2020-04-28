# 2020-demo-frontend

For all settings, configure the variables in a .env folder, similar to the [.env.example](.env.example)


* `admin-edge` server which listens for AMQP messages from the global admin application and writes to Infinispan
* `bot-server` bot server which plays the game for testing purposes
* `phone-server` socket server for the game.
* `phone-ui` frontend application which connects to the dev-phone-server

### DEV - run apps locally for development

To modify environment variables, create file `.env.dev` file.  For example, create the file with `REACT_APP_PHONE_SOCKET_URL=ws://game-frontend.apps.my-cluster.com/socket` to connect the phone-ui directly to a deployed backend cluster

* `make dev-infinispan` runs a container with Infinispan for server components to connect
* `make dev-admin-edge` 
* `make dev-bot-server`
* `make dev-phone-server`
* `make dev-phone-ui`

### BUILD - build images locally using s2i

* `make build-admin-edge`
* `make build-bot-server`
* `make build-phone-server`
* `make build-phone-ui`
* `make build` builds all


### PUSH - push images to repository

* `make push-admin-edge`
* `make push-bot-server`
* `make push-phone-server`
* `make push-phone-ui`
* `make push` pushes all s2i images
