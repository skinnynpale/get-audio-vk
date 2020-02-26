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
      console.log(scrollY);
      console.log(prevScrollY);
      await scrollTo();
      await page.waitFor(100);
    }
  };

  await scrollDown();
  await page.waitFor(1000);
  return page;
}

export default getScrolledDownPage;
