const proxy = require('http-proxy-middleware');


module.exports = function(app) {
  if (process.env.REACT_APP_PHONE_SOCKET_URL) {
    return;
  }

  let serverPort = process.env.PHONE_SERVER_PORT || '8081';

  app.use(proxy('/socket', {
    target: `http://0.0.0.0:${serverPort}`,
    ws: true
  }));

  app.use(proxy('/api', {
    target: `http://0.0.0.0:${serverPort}`,
    ws: false,
    pathRewrite: {
      '^/api': '/'
    }
  }));
};
