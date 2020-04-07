const http = require('http');
const CacheableLookup = require('cacheable-lookup');
const cacheable = new CacheableLookup();
cacheable.install(http.globalAgent);
const httpAgent = new http.Agent({ keepAlive: true });

const axios = require('axios').create({
  timeout: 10000,
  httpAgent
});

async function getAll({url, iterations}) {
  console.log(`=========== ${url}: DNS Cache = global =================`);

  const startTime = new Date();
  for (let i = 0; i < iterations; i++) {
    await getService({url})
  }
  const endTime = new Date();
  const timeDiff = endTime - startTime;
  console.info(`Total Service Request time for ${iterations} calls took ${Math.ceil(timeDiff/100)/10} s`);
}

async function getService({url}) {
  const startTime = new Date();

  try {
    const requestInfo = {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
      timeout: 10000,
      url
    };

    const response = await axios(requestInfo);
    // console.debug('response', response.data);
  } catch (error) {
    console.error('Service call failed', error.message);
  }

  const endTime = new Date();
  const timeDiff = endTime - startTime;

  if (timeDiff > 20) {
    console.warn(`Service response took ${timeDiff} ms`);
  }
}

(async function () {
  const url = process.argv[2] || "http://scoring.scoring.svc.cluster.local:8080/status";
  const iterations = process.argv[3] || 10000;
  await getAll({url, iterations});
})();
