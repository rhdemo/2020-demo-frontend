const env = require('env-var');

const PORT = env.get('PORT', '8080').asIntPositive();
const IP = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const LOG_LEVEL = env.get('LOG_LEVEL', 'info').asString();
const SCORING_URL = env.get('SCORING_URL').required().asString();


module.exports = {
  PORT,
  IP,
  LOG_LEVEL,
  SCORING_URL
};