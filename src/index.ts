import authBrowser from "./auth-browser";
import getScrolledDownPage from "./get-scrolled-down-page";

const puppeteer = require("puppeteer");
const nodeFetch = require("node-fetch");
const decode = require("../utils/decode");

const cookie =
  "remixlang=0; remixstid=1326033251_8da2AvbCV8rZJNzAeGs50jSxR2o3J3gKENoP9tZYvZX; remixflash=0.0.0; remixscreen_depth=24; remixscreen_orient=1; remixgp=2cac5f158b8954d9041f4d4192ae0319; remixdt=14400; tmr_lvid=0253f2dfd23ee62533b6e147b28d6856; tmr_lvidTS=1582615776101; remixusid=NzI3MGUxYThjOWNjNzNjZDQyMTAwY2Iw; remixvoice=0; remixrefkey=f277b9c7e0b0127d5c; remixsid=6e0ce346a5b90ef22a8392c2cc492cadfb3e7d6b943998398d48f41457629; remixseenads=0; tmr_reqNum=120; tmr_detect=0%7C1582652386258; remixcurr_audio=-158134892_456239159";

async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function getMp3(url: string) {
  const splitted = url.split("/");

  if (splitted[2].includes("cs")) {
    splitted.splice(4, 1);

    splitted[5] = splitted[5].replace(
      splitted[5].slice(0, splitted[5].indexOf(".m3u8")),
      splitted[4]
    );
    splitted[5] = splitted[5].replace(".m3u8", ".mp3");

    splitted.splice(4, 1);

    return splitted.join("/");
  }

  if (splitted[2].includes("ps")) {
    splitted.splice(5, 1);

    splitted[7] = splitted[7].replace(
      splitted[7].slice(0, splitted[7].indexOf(".m3u8")),
      splitted[6]
    );
    splitted[7] = splitted[7].replace(".m3u8", ".mp3");

    splitted.splice(6, 1);

    return splitted.join("/");
  }
}

function delay(time: number) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
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

async function parsePublic(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const dataAudios: string[] = await page.evaluate(() => {
    const posts = document.getElementById("page_wall_posts");
    const audios = posts && Array.from(posts.querySelectorAll(".audio_row"));
    return (
      audios && audios.map(item => JSON.parse((item as any).dataset.audio)[2])
    );
  });

  const encodedUrls = dataAudios
    .map(url => decode(url))
    .map(url => getMp3(url));

  console.log(encodedUrls);
}

function takeId(dataset: string) {
  const data = JSON.parse(dataset);
  const splitted = data[13].split("/");
  const unique = `${splitted[2]}_${splitted[5]}`;
  return `${data[1]}_${data[0]}_${unique}`;
}

async function parsePublicAudios(url: string) {
  let { browser, page } = await authBrowser();
  await page.goto(url);

  page = await getScrolledDownPage(page);

  const dataAudios: string[] = await page.evaluate(() => {
    const audios = Array.from(document.querySelectorAll(".audio_row"));
    return audios.map(item => (item as any).dataset.audio);
  });

  const ids = dataAudios.map(dataset => takeId(dataset));

  const encryptedUrls = await getEncryptedUrl(cookie, ids);

  // console.log(encryptedUrls);

  const encodedUrls = encryptedUrls.map(item => item[2]);

  console.log(encryptedUrls.length);

  const test = encodedUrls.map(item => item && decode(item));

  console.log(test);
}

// parsePublic("https://vk.com/skinnynpalebeats");

parsePublicAudios("https://vk.com/audios-158134892");

export { takeId, getEncryptedUrl, getMp3 };
