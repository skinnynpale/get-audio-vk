/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

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
  const result: any[] = [];
  const spliceIds = ids;

  await asyncForEach(spliceIds, async () => {
    const newIds = spliceIds.splice(0, 6).join(",");

    const response = await axios.post(
      "https://vk.com/al_audio.php",
      `act=reload_audio&al=1&ids=${newIds}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Cookie: cookie,
          "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
        }
      }
    );

    try {
      response.data.payload[1][0].forEach((item: any) => {
        if (!Array.isArray(item) && !item.length) return;
        result.push(item[2]);
      });
    } catch (err) {
      console.error(err);
      throw new Error("HTTP Request is failed, please send issue to repo");
    }

    console.log(`⚡ Finished ${result.length} tracks`);
    await delay(500);
  });

  return result;
}

export default getEncryptedUrl;
