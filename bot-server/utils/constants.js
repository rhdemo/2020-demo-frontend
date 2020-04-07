const env = require('env-var');

const LOG_LEVEL = env.get('LOG_LEVEL', 'info').asString();
const CLUSTER_NAME = env.get('CLUSTER_NAME', 'EDGE').asString();
const HOSTNAME = env.get('HOSTNAME', 'unknown-host').asString();
const GAME_SOCKET = env.get('GAME_SOCKET', 'ws://phone-server.frontend.svc.cluster.local:8080').asString();


module.exports = {
  LOG_LEVEL,
  CLUSTER_NAME,
  HOSTNAME,
  GAME_SOCKET
};