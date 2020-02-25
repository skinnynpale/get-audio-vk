import puppeteer from "puppeteer";

async function startBrowser(mode = true) {
  return await puppeteer.launch({ headless: mode, args: ["--no-sandbox"] });
}

export default startBrowser;
