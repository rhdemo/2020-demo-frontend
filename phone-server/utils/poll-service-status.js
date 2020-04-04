const log = require('../utils/log')('utils/poll-service-status');
const axios = require('./axios');
const {SCORING_URL} = require('./constants');



function pollServiceStatus(interval) {
  setTimeout(async () => {
    log.debug('checking service status');
    await checkScoringService();
    pollServiceStatus(interval);
  }, interval);
}

async function checkScoringService() {
  const startTime = new Date();

  try {
    const requestInfo = {
      timeout: 10000,
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
      url: new URL('/status', SCORING_URL).href
    };

    const response = await axios(requestInfo);
    log.debug('scoring service status', response.data);
  } catch (error) {
    log.error('Scoring service status failed', error.message);
  }

  const endTime = new Date();
  const timeDiff = endTime - startTime;

  if (timeDiff > 300) {
    log.warn(`Scoring service status took ${timeDiff} ms`);
  }
}


module.exports = pollServiceStatus;
