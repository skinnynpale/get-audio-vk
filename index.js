const puppeteer = require("puppeteer");
const fs = require("fs");
const fetch = require("node-fetch");
const decode = require("./utils/decode");

const ext = "C:\\Users\\skinnynpale\\Desktop\\uBlock0.chromium";
const datadir =
  "C:\\Users\\skinnynpale\\AppData\\Local\\Google\\Chrome\\User Data";
const cookie =
  "remixlang=0; remixstid=1727028087_f748ad9d9db59b5ba1; remixflash=0.0.0; remixscreen_depth=24; remixscreen_orient=1; remixgp=2cac5f158b8954d9041f4d4192ae0319; remixdt=14400; tmr_lvid=b44f7902896f41bc3de7c441898cc55a; tmr_lvidTS=1581926421796; remixusid=YjlkNzEwODI0YmQyMjU2ZjkyMmM0YTEy; remixab=1; remixlhk=89372037a473c35509; remixttpid=1ae0cdc204408bf31299826d4c1cb3fb8536812bec; remixsid=7825d74665a0d9723c5e6e4fc548df98ee8a9bee1ac270c9ffbcd69c955b0; remixrefkey=0c2439196ebdf675e4; remixcurr_audio=-97439489_456239058; remixvoice=0; remixseenads=0; tmr_reqNum=66; tmr_detect=0%7C1581965755940; remixsts=%7B%22data%22%3A%5B%5B1581965794%2C%22time_spent%22%2C%7B%22audio%22%3A%7B%22full%22%3A3001%2C%22last%22%3A1581965780407%2C%22options%22%3A%7B%7D%7D%7D%5D%5D%2C%22uniqueId%22%3A796043176%7D";

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function getRes() {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: datadir,
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`]
  });

  const page = await browser.newPage();
  await page.goto("https://vk.com/audios137567095");

  const tracks = new Set();

  const selectors = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll("div[data-full-id]"));
    return divs.map(item => item.dataset.fullId);
  });

  page.on("response", async response => {
    const url = response.url();
    if (url.includes("vkuseraudio")) {
      const result = getMp3(url);

      if (result.includes(".mp3") && !tracks.has(result)) {
        tracks.add(result);
        console.log("Добавлено: " + result);
        console.log("Кол-во треков: " + tracks.size);
      }
    }
  });

  await asyncForEach(selectors, async id => {
    await page.waitFor(500);
    await page.click(`div[data-full-id="${id}"]`);
  });
}

function getMp3(url) {
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

async function getEncryptedUrl(cookie, ids) {
  const result = [];

  await asyncForEach(ids, async id => {
    await fetch("https://vk.com/al_audio.php", {
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
        Cookie: cookie
      },
      body: `act=reload_audio&al=1&ids=${id}`,
      method: "POST"
    })
      .then(res => res.json())
      .then(res => result.push(JSON.stringify(res.payload[1][0][0])));
  });

  fs.writeFile("data.json", JSON.stringify(result), () =>
    console.log("Готово!")
  );
}

async function parsePublic(url) {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: datadir
  });
  const page = await browser.newPage();
  await page.goto(url);

  const dataAudios = await page.evaluate(() => {
    const posts = document.getElementById("page_wall_posts");
    const audios = Array.from(posts.querySelectorAll(".audio_row"));
    return audios.map(item => JSON.parse(item.dataset.audio)[2]);
  });

  const encodeedUrls = dataAudios
    .map(url => decode(url))
    .map(url => getMp3(url));

  console.log(encodeedUrls);
}

async function parsePublicAudios(url) {
  function takeId(dataset) {
    const data = JSON.parse(dataset);
    const splitted = data[13].split("/");
    const unique = `${splitted[2]}_${splitted[5]}`;
    return `${data[1]}_${data[0]}_${unique}`;
  }

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: datadir
  });
  const page = await browser.newPage();
  await page.goto(url);

  const dataAudios = await page.evaluate(() => {
    const audios = Array.from(document.querySelectorAll(".audio_row"));
    return audios.map(item => item.dataset.audio);
  });

  const ids = dataAudios.map(str => takeId(str));

  getEncryptedUrl(cookie, ids);

  // const encodeedUrls = dataAudios
  //   .map(url => decode(url))
  //   .map(url => getMp3(url));
}

const ids =
  "-158134892_456239159_5af83481291a165afd_1035dde830a8f3b557,-158134892_456239158_7d3e71766f19e3c1c9_3da60043538e6c2fe2,-158134892_456239156_3061b6965e425d0b15_5ac5362cc85f3ce3d0,-158134892_456239153_7938cfbfc210f1dd7b_d293d0b0fd156c2bca,-158134892_456239154_cbc090ad99d832b99b_b993a5247cdcbb1db3,-158134892_456239159_5af83481291a165afd_1035dde830a8f3b557";

// getEncryptedUrl(cookie, ids);

// parsePublic("https://vk.com/skinnynpalebeats");

parsePublicAudios("https://vk.com/audios-158134892");
