import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export const getGMBAnalyze = async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to Google Maps search result
    await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(input)}`, {
      waitUntil: "networkidle2",
      timeout:30000
    });

    //Wait for the results sidebar to appear
    await page.waitForSelector(".Nv2PK", { timeout: 15000 });

    //Scroll the sidebar to load more results
    await getScrollContent(page);

    //Extract details
    const result = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".Nv2PK")).map((el) => {
        const getText = (selector) => el.querySelector(selector)?.innerText || "N/A";
        const getHref = (selector) => el.querySelector(selector)?.href || "N/A";

        const name = getText(".qBF1Pd");
        const type = getText(".W4Efsd > div:first-child > span:nth-child(1) > span");
        const address = getText(".W4Efsd span:nth-child(3)");
        const rating = parseFloat(getText(".MW4etd")) || "N/A";
        let reviewCount = getText(".UY7F9").replace(/[(),]/g, "") || "N/A";
        reviewCount = parseFloat(reviewCount) || "N/A";

        const profileLink = getHref("a.hfpxzc");
        const directionLink = name !== "N/A"
          ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(name)}`
          : "N/A";
        const websiteLink = getHref('a[href*="http"]:not([href*="google.com"])');
        const bookOnlineLink = getHref(".A1zNzb");
        let callNumber = getText(".UsdlK").replace(/\D/g, "") || "N/A";

        return {
          name,
          address,
          type,
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

    await browser.close();
    res.json({
      message: "Extraction successful",
      doctorsData: result,
    });
  } catch (error) {
    console.error("Error during scraping:", error);
    if (browser) await browser.close();
    res.status(500).json({ error: "Failed to scrape the page" });
  }
};


async function getScrollContent(page)
{
  console.log("Running scroll down function")
  const section = await page.$(".m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde")
  if(section !== null)
  {
    console.log("Found section")
    const numScrolls =100
    const delayedBetweenScrollMills = 2000;
    for( let i=0; i<numScrolls; i++)    
    {
     try {
      const boundingBox = await getBoundingBox(section)
      await scrollDown(page,boundingBox)     //Await the scrollDown function
      await delay(delayedBetweenScrollMills)   //Promise-base delay
     } catch (error) {
      console.log("Error during scrolling :", error)
      break;
     }
    }
    return true
  }
  else
  {
    console.log("failed to find section")
    return false;
  }

}

//Get the bounding box for the element to be scrolled

async function getBoundingBox(elementHandle) {
   const boundingBox = await elementHandle.boundingBox()
   if(boundingBox !== null)
   {
    console.log(boundingBox)
    return boundingBox;
   }
   else
   {
    throw new Error("Failed to find the bounding box for provided element")
   }
}
async function scrollDown(page, boundingBox) {
  //move mouse to the center of the element to be scrolled
  page.mouse.move(
    boundingBox.x + boundingBox.width/2,
    boundingBox.y + boundingBox.height/2
  )
  //use mouse scroll wheel to scroll.
  await page.mouse.wheel({deltaY: 300})
  
}

// delay function 
function delay(ms)
{
 return new Promise((resolve) => setTimeout(resolve, ms));
}