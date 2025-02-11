import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export const getGMBAnalyze = async (req, res) => {
  console.log(req.body)
  const { search } = req.body;
 

  if (!search) {
    return res.status(400).json({ error: "Input is required" });
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to Google Maps search result
    await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(search)}`, {
      waitUntil: "networkidle2",
      timeout:30000
    });

    //Wait for the results sidebar to appear
    await page.waitForSelector(".Nv2PK", { timeout: 15000 });

    //Scroll the sidebar to load more results
    await getScrollContent(page);

   
     // Extract profile links and elements
     const doctorCards = await page.$$(".Nv2PK");

     let results = [];
 
     for (const card of doctorCards) {
       // Click on each card to open the side modal
       await card.click();
       console.log("Clicked on card")
       await delay(2000)
 
       // Wait for the side modal to appear
       await page.waitForSelector(".DkEaL", { timeout: 10000 }).catch(() => console.log("No modal found"));
 
       // Extract details from the modal
       const doctorDetails = await page.evaluate(() => {
         const getText = (selector) => document.querySelector(selector)?.innerText.trim() || "N/A";
         const getHref = (selector) => document.querySelector(selector)?.href || "N/A";
 
         return {
           name: getText(".DUwDvf"),
           type: getText("button.DkEaL"),
           address: getText(".Io6YTe"), // Updated Address
           rating: parseFloat(getText(".F7nice span[aria-hidden='true']")) || "N/A",
           reviewCount: parseFloat(getText('.F7nice span[aria-label]:nth-child(1)')?.replace(/[(),]/g, "")) || "N/A",
          //  profileLink: getHref('a.hfpxzc'),   //fix
           directionEnabel: document.querySelector('button[aria-label^="Directions"]')? true : false,  
           websiteLink: getHref('a.CsEnBe'),  
           bookOnlineLink: getHref('DkEaL a.A1zNzb'), 
           callNumber: getHref("a[aria-label='Call phone number']").replace("tel:",""),
           openHours: getText(".G8aQO")
         };
       });
 
       results.push(doctorDetails);
 
       // Close modal before clicking the next card
       await page.keyboard.press("Escape");
       await delay(1000);
     }
 
     res.json({ message: "Extraction successful", doctorsData: results });
   } catch (error) {
     console.error("Error during scraping:", error);
     res.status(500).json({ error: "Failed to scrape the page" });
   } finally {
     if (browser) await browser.close();
   }
};


async function getScrollContent(page)
{
  console.log("Running scroll down function")
  const section = await page.$(".m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde")
  if(section !== null)
  {
    console.log("Found section")
    const delayBetweenScrolls =2000; 
    let previousContentLength = 0;
    let newContentLength = 0;
    let scrollAttempts =0;
    const maxScrollAttempts = 3;  //Maximum Scroll attempts to avoid infinite loops
    while (scrollAttempts < maxScrollAttempts)
    {
      try{
        //get the current number of loaded items
        previousContentLength = await page.evaluate(()=>
        {
          return document.querySelectorAll('.Nv2PK').length
        })
        //Scroll down
        const boundingBox = await getBoundingBox(section);
        await scrollDown(page, boundingBox)

        //wait 2s for new content to load
        await delay(delayBetweenScrolls)

        newContentLength = await page.evaluate(()=>
        {
          return document.querySelector('.Nv2PK').length;
        });
        //If no new content is loaded, stop scrolling
        if(newContentLength === previousContentLength)
        {
          console.log("No new content loaded. Stopping scroll")
          break;
        }
          scrollAttempts++
      }
      catch(error){

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
   const boundingBox = await elementHandle.boundingBox()  //Return bounding box of element relative to frame
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
