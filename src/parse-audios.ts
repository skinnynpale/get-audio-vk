import getAuthPage from "./get-auth-page";
import getScrolledDownPage from "./get-scrolled-down-page";
// @ts-ignore
import decode from "../utils/decode";
import getEncryptedUrl from "./get-encypted-url";

async function parseAudios(id: string, cookie: string) {
  const { browser, page } = await getAuthPage();
  await page.goto(`https://vk.com/audios${id}`);
  await getScrolledDownPage(page);

  const dataAudios: string[] = await page.evaluate(() => {
    const audios = Array.from(document.querySelectorAll(".audio_row"));
    return audios.map(item => (item as any).dataset.audio);
  });
  const ids = dataAudios.map(dataset => takeId(dataset));
  const encryptedUrls = await getEncryptedUrl(cookie, ids.splice(0, 10));
  const encodedUrls = encryptedUrls.map(item => item[2]);
  const test = encodedUrls.map(item => item && decode(item));
  console.log(test);
}

function takeId(dataset: string) {
  const data = JSON.parse(dataset);
  const splitted = data[13].split("/");
  const unique = `${splitted[2]}_${splitted[5]}`;
  return `${data[1]}_${data[0]}_${unique}`;
}

export default parseAudios;
