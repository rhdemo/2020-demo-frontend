const got = require('got');


async function getAll({url, iterations}) {
  console.log(`=========== ${url} =================`);
  const startTime = new Date();
  for (let i = 0; i < iterations; i++) {
    await getService(url)
  }
  const endTime = new Date();
  const timeDiff = endTime - startTime;
  console.info(`Total Service Request time for ${iterations} calls took ${Math.ceil(timeDiff/100)/10} s`);
}

async function getService(url) {
  const startTime = new Date();

  try {
    const response = await got.get(url, {timeout: 10000});
    // console.debug('response', response.body);
  } catch (error) {
    console.error('Service call failed', error);
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
