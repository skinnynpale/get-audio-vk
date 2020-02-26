require("dotenv").config();

import startBrowser from "./browser";

const LOGIN = process.env.LOGIN;
const PASS = process.env.PASS;

async function getAuthPage() {
  if (!(LOGIN && PASS)) throw new Error("Нет логина или пароля");

  const browser = await startBrowser();
  const page = await browser.newPage();

  await page.goto("https://vk.com/feed");
  await page.waitFor("input[id=email]");

  await page.$eval(
    'input[id="email"]',
    (el, LOGIN) => ((el as HTMLInputElement).value = LOGIN),
    LOGIN
  );
  await page.$eval(
    'input[id="pass"]',
    (el, PASS) => ((el as HTMLInputElement).value = PASS),
    PASS
  );

  await page.click("#login_button");
  await page.waitFor("div.top_profile_name");

  return { browser, page };
}

export default getAuthPage;
