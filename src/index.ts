import { Browser } from "puppeteer";
import getScrolledDownPage from "./get-scrolled-down-page";
import getEncryptedUrl from "./get-encypted-url";

// @ts-ignore
import decode from "../utils/decode";
import startBrowser from "./browser";

function takeId(dataset: string) {
  const data = JSON.parse(dataset);
  const splitted = data[13].split("/");
  const unique = `${splitted[2]}_${splitted[5]}`;
  return `${data[1]}_${data[0]}_${unique}`;
}

interface ParseConfig {
  login: string;
  pass: string;
  yourId: string;
  headless?: boolean;
}

class ParseAudios {
  private browser!: Browser;

  constructor(private readonly config: ParseConfig) {
    if (!(config.login && config.pass && config.yourId)) {
      throw new Error("Login, pass or yourId is undefined");
    }
  }

  async launch() {
    this.browser = await startBrowser(this.config.headless);
    await this.makeAuthBrowser();
  }

  async exit() {
    await this.browser.close();
  }

  async run(id: number, max = 0) {
    const page = await this.browser.newPage();
    await page.goto(`https://vk.com/audios${id}`);
    const { cookie } = await getScrolledDownPage(page);

    const dataAudios: string[] = await page.evaluate(max => {
      const audios = Array.from(document.querySelectorAll(".audio_row"));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      const encodedMp3 = item.mp3 && decode(item.mp3, this.config.yourId);
      return { ...item, mp3: encodedMp3 };
    });
    tracks.splice(0, 1); // remove first broken element
    return tracks;
  }

  async makeAuthBrowser() {
    const page = await this.browser.newPage();
    await page.goto("https://vk.com/feed");
    await page.waitFor("input[id=email]");

    await page.$eval(
      'input[id="email"]',
      (el, login) => ((el as HTMLInputElement).value = login),
      this.config.login
    );
    await page.$eval(
      'input[id="pass"]',
      (el, pass) => ((el as HTMLInputElement).value = pass),
      this.config.pass
    );

    await page.click("#login_button");
    await page.waitFor("div.top_profile_name");
    await page.close();
  }
}

export { ParseAudios };
