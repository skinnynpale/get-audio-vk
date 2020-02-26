import async from "async";

import makeAuthBrowser from "./make-auth-browser";
import getScrolledDownPage from "./get-scrolled-down-page";
// @ts-ignore
import decode from "../utils/decode";
import getEncryptedUrl from "./get-encypted-url";
import { Browser } from "puppeteer";
import startBrowser from "./browser";

function takeId(dataset: string) {
  const data = JSON.parse(dataset);
  const splitted = data[13].split("/");
  const unique = `${splitted[2]}_${splitted[5]}`;
  return `${data[1]}_${data[0]}_${unique}`;
}

class ParseAudios {
  constructor(public browser: Browser) {}

  async run(id: number, cookie: string, max = 0) {
    const page = await this.browser.newPage();
    await page.goto(`https://vk.com/audios${id}`);
    await getScrolledDownPage(page);

    const dataAudios: string[] = await page.evaluate(max => {
      const audios = Array.from(document.querySelectorAll(".audio_row"));
      const data = audios.map(item => (item as any).dataset.audio);

      if (max) {
        return data.splice(0, max);
      }
      return data;
    }, max);

    await page.close();

    const ids = dataAudios.map(dataset => takeId(dataset));
    const encryptedUrls = await getEncryptedUrl(cookie, ids);
    let tracks = encryptedUrls.map(
      item =>
        item && {
          mp3: item[2],
          author: item[4],
          title: item[3],
          cover: item[14] && item[14].split(",")[1]
        }
    );

    tracks = tracks.map(item => {
      const encodedMp3 = item.mp3 && decode(item.mp3);
      return { ...item, mp3: encodedMp3 };
    });

    tracks.splice(0, 1); // remove first broken element

    console.log(tracks);
    return tracks;
  }
}

// (async () => {
//   const cookie =
//     "remixlang=0; remixstid=1326033251_8da2AvbCV8rZJNzAeGs50jSxR2o3J3gKENoP9tZYvZX; remixflash=0.0.0; remixscreen_depth=24; remixscreen_orient=1; remixgp=2cac5f158b8954d9041f4d4192ae0319; remixdt=14400; tmr_lvid=0253f2dfd23ee62533b6e147b28d6856; tmr_lvidTS=1582615776101; remixusid=NzI3MGUxYThjOWNjNzNjZDQyMTAwY2Iw; remixvoice=0; remixrefkey=f277b9c7e0b0127d5c; remixua=-1%7C-1%7C162%7C-285897395; remixsid=59839506b892ecbfee7eb9688253647274c5d2d3ef2f9546a4d87522e9fbe; tmr_detect=0%7C1582718359157; tmr_reqNum=177; remixseenads=0; remixsts=%7B%22data%22%3A%5B%5B1582718459%2C%22audio_sts%22%2C1%2C7%2C1%2C%22-119051694_456239203%22%2C%226f3e00cfWUDFSnerrtv8gRrsqRY1vI2kpzgSOnDzmEq3BiY%22%2C2%2C%22%22%2C%22group_list%22%2C20%2C1%2C0%2C0%2C1%2C%22-119051694_-1%22%5D%5D%2C%22uniqueId%22%3A336302778%7D; remixcurr_audio=-119051694_456239209";
//
//   const browser = await startBrowser(false);
//   await makeAuthBrowser(browser);
//
//   const parse = new ParseAudios(browser);
//
//   const queueArray = async.queue(async (task: Function, callback: Function) => {
//     await task();
//   }, 10);
//
//   queueArray.drain(async () => {
//     await browser.close();
//   });
//
//   // tests
//   queueArray.push(() => parse.run(19463413, cookie, 5));
//   queueArray.push(() => parse.run(377897606, cookie, 5));
//
//   setTimeout(() => {
//     queueArray.push(() => parse.run(-165626408, cookie, 5));
//   }, 10000);
// })();

export default ParseAudios;
