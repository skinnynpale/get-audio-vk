/* eslint-disable @typescript-eslint/no-explicit-any */
const nodeFetch = require("node-fetch");

function delay(time: number) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}

async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function getEncryptedUrl(cookie: string, ids: string[]) {
  const result: [string[]] = [[]];
  const spliceIds = ids;

  await asyncForEach(spliceIds, async () => {
    const newIds = spliceIds.splice(0, 5).join(",");

    await nodeFetch("https://vk.com/al_audio.php", {
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
        Cookie: cookie
      },
      body: `act=reload_audio&al=1&ids=${newIds}`,
      method: "POST"
    })
      .then((res: { json: () => any }) => res.json())
      .then((res: any) => {
        res.payload[1][0].forEach((item: any) => {
          if (!Array.isArray(item)) return;
          result.push(item);
        });
      })
      .catch((err: Error) => {
        console.log(err);
      });

    console.log(result.length);

    await delay(500);
  });

  return result;
}

export default getEncryptedUrl;
