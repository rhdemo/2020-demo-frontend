const env = require('env-var');

const PORT = env.get('PORT', '8080').asIntPositive();
const IP = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const LOG_LEVEL = env.get('LOG_LEVEL', 'info').asString();
const CLUSTER_NAME = env.get('CLUSTER_NAME', 'EDGE').asString();
const HOSTNAME = env.get('HOSTNAME', 'unknown-host').asString();


module.exports = {
  PORT,
  IP,
  LOG_LEVEL,
  CLUSTER_NAME,
  HOSTNAME
};