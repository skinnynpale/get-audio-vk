/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

async function getEncryptedUrl(cookie: string, ids: string[]) {
  const result: any[] = [];

  const promises = ids.map(async id => {
    return await axios.post(
      "https://vk.com/al_audio.php",
      `act=reload_audio&al=1&ids=${id}`,
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
  });

  await Promise.all(promises).then(responses => {
    responses.forEach(track => {
      try {
        const data = track.data.payload[1][0];
        if (typeof data !== "undefined") {
          data.forEach((item: any) => {
            if (!Array.isArray(item) && !item.length) return;
            result.push(item[2]);
          });
        }
      } catch (err) {
        console.error(err);
        throw new Error("HTTP Request is failed, please restart");
      }
    });
  });

  return result;
}

export default getEncryptedUrl;
