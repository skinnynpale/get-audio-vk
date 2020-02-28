import { Page } from "puppeteer";

async function getScrolledDownPage(page: Page) {
  const scrollDown = async () => {
    let scrollY = 1;
    let prevScrollY = 0;

    const scrollTo = async () => {
      prevScrollY = scrollY;
      scrollY = await page.evaluate(() => {
        window.scrollTo(0, window.scrollY + 5000);
        return window.scrollY;
      });
    };

    while (scrollY !== prevScrollY) {
      console.log(`scrollY - ${scrollY}`);
      await scrollTo();
      await page.waitFor(100);
    }
  };

  await page.click(".audio_row");
  const cookie = (await page.cookies())
    .map(cookie => {
      return `${cookie.name}=${cookie.value}`;
    })
    .join("; ");

  await scrollDown();
  await page.waitFor(1000);
  return { cookie, page };
}

export default getScrolledDownPage;
