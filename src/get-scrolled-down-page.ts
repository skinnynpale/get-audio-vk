import { Page } from "puppeteer";

async function getScrolledDownPage(page: Page) {
  const scrolledPage = page;

  const scrollDown = async () => {
    let scrollY = 1;
    let prevScrollY = 0;

    const scrollTo = async () => {
      prevScrollY = scrollY;
      scrollY = await scrolledPage.evaluate(() => {
        window.scrollTo(0, window.scrollY + 5000);
        return window.scrollY;
      });
    };

    while (scrollY !== prevScrollY) {
      console.log(scrollY);
      console.log(prevScrollY);
      await scrollTo();
      await scrolledPage.waitFor(100);
    }
  };

  await scrollDown();
  await scrolledPage.waitFor(5000);
  return scrolledPage;
}

export default getScrolledDownPage;
