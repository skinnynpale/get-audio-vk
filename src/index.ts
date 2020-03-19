import { Browser, Page } from "puppeteer";
import getScrolledDownPage from "./get-scrolled-down-page";
import getEncryptedUrl from "./get-encypted-url";

// @ts-ignore
import decode from "../utils/decode";
import startBrowser from "./browser";

function takeId(data: string) {
  const splitted = data[13].split("/");
  const unique = `${splitted[2]}_${splitted[5]}`;
  return `${data[1]}_${data[0]}_${unique}`;
}

async function getCookie(page: Page) {
  await page.click(".audio_row");
  const cookie = (await page.cookies())
    .map(cookie => {
      return `${cookie.name}=${cookie.value}`;
    })
    .join("; ");
  return cookie;
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
    await getScrolledDownPage(page);
    const cookie = await getCookie(page);

    const audiosDataset: string[] = await page.evaluate(max => {
      const audios = Array.from(document.querySelectorAll(".audio_row"));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = audios.map(item => JSON.parse((item as any).dataset.audio));

      if (max) {
        return data.splice(0, max);
      }

      return data;
    }, max);

    let tracks = audiosDataset.map(track => ({
      mp3: "",
      title: track[3],
      author: track[4],
      cover: track[14] && track[14].split(",")[1]
    }));

    await page.close();

    const ids = audiosDataset.map(dataset => takeId(dataset));

    const slicedIds: string[] = [];
    for (let i = 0; i <= ids.length; i += 7) {
      slicedIds.push(ids.slice(i, i + 7).join(","));
    }

    const encryptedUrls = await getEncryptedUrl(cookie, slicedIds);

    tracks = encryptedUrls.map((item, index) => ({
      ...tracks[index],
      mp3: item
    }));

    tracks = tracks.map(item => {
      const encodedMp3 = item.mp3 && decode(item.mp3, this.config.yourId);
      return { ...item, mp3: encodedMp3 };
    });

    console.log(
      `⚡ Finished ${tracks.length} / ${audiosDataset.length} tracks`
    );
    return tracks;
  }

  async makeAuthBrowser() {
    console.log("login...");
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
    await page.waitFor("div.top_profile_name", { timeout: 10000 }).catch(() => {
      throw new Error(
        "Timeout 10s \n Failed to auth, possible reasons: \n 1. Incorrect login or password \n 2. Showed captcha \n 3." +
          " Slowly internet \n" +
          "4. Slowly computer"
      );
    });
    await page.close();
    console.log(`✅ Auth`);
  }
}

export { ParseAudios };
