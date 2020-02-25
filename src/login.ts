import { getEncryptedUrl, takeId } from "./index";

require("dotenv").config();

// @ts-ignore
import decode from "../utils/decode.js";
import authBrowser from "./auth-browser";

async function login() {
  const { browser, page } = await authBrowser();

  await page.goto(`https://vk.com/audios${process.env.ID}`);
  await page.waitFor("div.audio_page__rows_wrap");

  // page = await getScrolledDownPage(page);

  const dataAudios: string[] = await page.evaluate(() => {
    const audios = Array.from(document.querySelectorAll(".audio_row"));
    return audios.map(item => (item as any).dataset.audio);
  });

  const cookie =
    "remixlang=0; remixstid=1326033251_8da2AvbCV8rZJNzAeGs50jSxR2o3J3gKENoP9tZYvZX; remixflash=0.0.0; remixscreen_depth=24; remixscreen_orient=1; remixgp=2cac5f158b8954d9041f4d4192ae0319; remixdt=14400; tmr_lvid=0253f2dfd23ee62533b6e147b28d6856; tmr_lvidTS=1582615776101; remixusid=NzI3MGUxYThjOWNjNzNjZDQyMTAwY2Iw; remixvoice=0; remixrefkey=f277b9c7e0b0127d5c; remixsid=6e0ce346a5b90ef22a8392c2cc492cadfb3e7d6b943998398d48f41457629; remixseenads=0; remixcurr_audio=137567095_456239364; tmr_reqNum=112; tmr_detect=0%7C1582651443626";

  const ids = dataAudios.map(dataset => takeId(dataset));

  const encryptedUrls = await getEncryptedUrl(cookie, ids);

  const encodedUrls = encryptedUrls
    .map(item => item[2])
    .map(item => decode(item));

  console.log(encodedUrls);

  await browser.close();
}

login()
  .then(() => console.log("Готово!"))
  .catch(err => console.error(err));
