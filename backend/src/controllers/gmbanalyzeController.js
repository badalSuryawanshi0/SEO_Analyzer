import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Use the stealth plugin
puppeteer.use(StealthPlugin());

export const getgmbanalyze = async (req, res) => {
  const { input } = req.body;
  console.log(input);

  if (!input) {
    return res.status(400).json({ error: "input is required" });
  }

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: false }); // Set to true for production
    const page = await browser.newPage();

    // Navigate to Google Maps search result
    await page.goto(`https://www.google.com/maps/search/${input}`, {
      waitUntil: "networkidle2",
    });

    await page.evaluate(async () => {
      const sidebar = document.querySelector(".m6QErb.DxyBCb.kA9KIf.dS8AEf");
      if (!sidebar) return;

      let previousHeight = sidebar.scrollHeight;
      let attempts = 0;
      const maxAttempts = 10; // Adjust if needed

      while (attempts < maxAttempts) {
        sidebar.scrollBy(0, sidebar.scrollHeight); // Scroll down fully

        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for loading

        let newHeight = sidebar.scrollHeight;
        if (newHeight === previousHeight) {
          break; // Stop if no new content is loaded
        }
        previousHeight = newHeight;
        attempts++;
      }
    });
    // Extract clinic details
    const result = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".Nv2PK")).map((el) => {
        const name = el.querySelector(".qBF1Pd")?.innerText || "N/A";
        const address =
          el.querySelector(".W4Efsd span:nth-child(3)")?.innerText || "N/A";
        const rating = el.querySelector(".MW4etd")?.innerText || "N/A";
        const reviewCount = el.querySelector(".UY7F9")?.innerText || "N/A";
        const profileLink = el.querySelector("a.hfpxzc")?.href || "N/A";

        // Extract actual links
        const directionElement = el.querySelector('[data-value="Directions"]');
        const directionLink = directionElement
          ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              name
            )}`
          : "N/A";

        const websiteLink =
          el.querySelector('a[href*="http"]:not([href*="google.com"])')?.href ||
          "N/A";
        const bookOnlineLink =
          el.querySelector('[aria-label*="Book"]')?.href || "N/A";
        const callNumber = el.querySelector(".UsdlK")?.innerText || "N/A"; // Extract phone number from text

        return {
          name,
          address,
          rating,
          reviewCount,
          profileLink,
          directionLink,
          websiteLink,
          bookOnlineLink,
          callNumber,
        };
      });
    });

    // Close the browser
    await browser.close();
    console.log(result);

    // Return the scraped data
    res.json({
      message: "Extraction successful",
      data: result,
    });
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Failed to scrape the page" });
  }
};
