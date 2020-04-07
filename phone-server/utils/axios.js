const http = require('http');
const httpAgent = new http.Agent({ keepAlive: true });

const axiosClient = require('axios').create({
  timeout: 5000,
  httpAgent
});

require('axios-cached-dns-resolve').registerInterceptor(axiosClient);

module.exports = axiosClient;
