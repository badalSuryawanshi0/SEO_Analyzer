import puppeteer from "puppeteer";
export async function fetchDynamicContent(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" }); //wait till dynamic content to load
  // Wait for blog containers to appear
  try {
    await page
      .waitForSelector("article, .post, .blog-post, .entry, .blog-item", {
        timeout: 5000,
      })
      .catch(() => {
        console.log("Optional selectors not found.");
      });

    // Scroll to load more content (if needed)
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error("Error during content fetching:", error);
  } finally {
    const content = await page.content();
    await browser.close();
    return { content, page };
  }
}
