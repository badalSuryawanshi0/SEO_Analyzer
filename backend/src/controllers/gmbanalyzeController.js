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
     const seenProfiles = new Set(); // Track unique profiles so we can ignore the duplicate profiles

     for (const card of doctorCards) {
       // Get gmb link before clicking on card
       let link = await card.$eval('a.hfpxzc', el => el.href).catch(() => null);
       
       // Skip if we've already processed this profile
       if (link && seenProfiles.has(link)) {
         console.log("Skipping duplicate profile:", link);
         continue;
       }
       
       // Add to seen profiles if it's a valid link
       if (link) {
         seenProfiles.add(link);
       }
       
       // Click on each card to open the side modal
       await card.click();
       console.log("Clicked on card");
       await delay(3000); // Increased delay after click

       // Wait for the side modal to appear and content to load
       await page.waitForSelector(".DkEaL", { timeout: 10000 })
         .catch(() => console.log("No modal found"));
       
       // Additional delay to ensure content is fully loaded
       await delay(2000);

       // Extract details from the modal
       const doctorDetails = await page.evaluate((profileLink) => {
         const getText = (selector) => document.querySelector(selector)?.innerText.trim() || "N/A";
         const getHref = (selector) => document.querySelector(selector)?.href || "N/A";

         return {
           name: getText(".DUwDvf"),
           profileLink: profileLink,
           type: getText("button.DkEaL"),
           address: getText(".Io6YTe"),
           rating: parseFloat(getText(".F7nice span[aria-hidden='true']")) || "N/A",
           reviewCount: parseFloat(getText('.F7nice span[aria-label]:nth-child(1)')?.replace(/[(),]/g, "")) || "N/A",
           directionEnabel: document.querySelector('button[aria-label^="Directions"]') ? true : false,
           websiteLink: getHref('a.CsEnBe'),
           bookOnlineLink: getHref('div.KDpVjd.yMo4fd.YMucub a.A1zNzb'),
           callNumber: getHref("a[aria-label='Call phone number']").replace("tel:", ""),
           openHours: getText(`.y0skZc td.mxowUb[role="text"]`).split('\n')[0]
         };
       }, link);
        
       // Calculate listing score
       const calculateScore = (details) => {
         let score = 0;
         
         
         if (details.name !== "N/A") score += 5;
         if (details.address !== "N/A") score += 10;
         if (details.type !== "N/A") score += 5;
         
        
         if (details.rating !== "N/A") score += 5;
         if (details.reviewCount !== "N/A") score += 10;
         if (details.websiteLink !== "N/A") score += 10;
         if (details.callNumber !== "N/A") score += 10;
         
        
         if (details.openHours !== "N/A") score += 10;
         if (details.directionEnabel) score += 5;
         if (details.bookOnlineLink !== "N/A") score += 15;
         if(details.bookingProcess !=="N/A") score += 15;
         
         return score;
       };
       const thirdPartyDoctorSites = [
        "https://www.practo.com/",
        "https://www.apollohospitals.com/",
        "https://www.healthplix.com/",
        "https://remedoapp.com/",
        "https://www.zocdoc.com/",
        "https://www.doctolib.com/",
        "https://www.lybrate.com/",
        "https://www.docplanner.com/",
        "https://www.vezeeta.com/",
        "https://www.mfine.co/",
        "https://www.1mg.com/",
        "https://www.amwell.com/",
       " https://www.eka.care/",
       "https://www.docgenie.in/",
       "https://www.narayanahealth.org/",
       "https://healthfirstcenter.in/",
       "https://navedahealthcare.com/",
       "https://www.apollo247.com/"
      ];

       if (doctorDetails.websiteLink && doctorDetails.websiteLink !== 'N/A') {
         try {
          //intialize booking process
          doctorDetails.bookingProcess = {};
          //Check if the webiste link is third party ?
            const validate = thirdPartyDoctorSites.find((site)=>doctorDetails.websiteLink.includes(site))
            if(validate && validate !== undefined)
            {
              doctorDetails.bookingProcess.thirdParty = true
              doctorDetails.bookingProcess.link = doctorDetails.websiteLink
            }

           else{
            const extractedData = await extractData(doctorDetails.websiteLink);
            console.log("Loggin the data from extractedData", extractData)
            doctorDetails.bookingProcess = extractedData;
           }
         } catch (error) {
             doctorDetails.bookingProcess = { error: error.message };
            
         }
       }
       else {
        doctorDetails.bookingProcess = "N/A"
       }
       const listingScore = calculateScore(doctorDetails);
       results.push({
         ...doctorDetails,
         score: listingScore
       });

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


async function getScrollContent(page) {
  console.log('Running scroll down function');
  const section = await page.$('.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde');
  if (section !== null) {
    console.log('Found section');
    const delayBetweenScrolls = 1000; 
    let previousContentLength = 0;
    let newContentLength = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 20; // Increased attempts for thorough scrolling
    while (scrollAttempts < maxScrollAttempts) {
      try {
        // Get the current number of loaded items
        previousContentLength = await page.evaluate(() =>
          document.querySelectorAll('.Nv2PK').length
        );
        // Scroll down
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

/* Extract booking options from a given URL.
 * @param  url - The URL of the website to analyze for booking options.
 * @returns - An object indicating the presence of booking forms and timeslots.
 */
export const extractData = async (url) => {
  console.log("Analyzing booking options for:", url);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the URL and wait for the page to load
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    // Search for a "Book Now" button
    const buttonFound = await page.evaluate(() => {
      const buttonTexts = ['book appointment', 'schedule meeting', 'reserve slot', 'make appointment', 
                          'book', 'schedule', 'appointment', 'reserve'];
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.some(btn => 
        buttonTexts.some(text => btn.textContent.toLowerCase().includes(text))
      );
    });

    // If no button is found, return false for both options
    if (!buttonFound) {
      // Initial check for booking options on the page
    const initialCheck = await page.evaluate(() => {
      const hasForm = !!(
        document.querySelector('form[action*="book"]:not([action*="facebook"]), form[action*="schedule"], form[action*="reserve"]') ||
        document.querySelector('form[action*="slot"], form[action*="appointment"]')
      );

      const hasTimeslot = !!(
        document.querySelector('.booking-time-slot,form[action*="formResponse"], [id*="booking-time"], [class*="booking-time"]') ||
        document.querySelector('.booking-calendar, [id*="booking-calendar"], [class*="booking-calendar"]') ||
        document.querySelector('input[type="date"][name*="booking"], input[type="datetime-local"][name*="booking"]') ||
        document.querySelector('[href*="booking/slot/reserve"]') ||
        document.querySelector('[href*="booking/calendar"]') ||
        document.querySelector('div[class*="booking-slot"], a[class*="booking-slot"]') ||
        document.querySelector('div[class*="booking-time"]:not([class*="timeline"])') ||
        document.querySelector('[href*="booking/consultation"], [class*="booking-consultation"]')
      );

      return { hasForm, hasTimeslot };
    });

    // Return early if booking options are found
    if (initialCheck.hasForm || initialCheck.hasTimeslot) {
      return initialCheck;
    }  
    return { hasForm: false, hasTimeslot: false };
    }
    

    // Simulate a click on the "Book Now" button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const buttonTexts = ['book appointment', 'schedule meeting', 'reserve slot', 'make appointment', 
                          'book', 'schedule', 'appointment', 'reserve'];
      const bookButton = buttons.find(btn =>
        buttonTexts.some(text => btn.textContent.toLowerCase().includes(text))
      );
      if (bookButton) bookButton.click();
    });

    // Wait for navigation after the button click
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(() => {});
     // Check if Book button redirect to third-Party link
     const thirdPartyDoctorSites = [
      "https://www.practo.com/",
      "https://www.apollohospitals.com/",
      "https://www.healthplix.com/",
      "https://remedoapp.com/",
      "https://www.zocdoc.com/",
      "https://www.doctolib.com/",
      "https://www.lybrate.com/",
      "https://www.docplanner.com/",
      "https://www.vezeeta.com/",
      "https://www.mfine.co/",
      "https://www.1mg.com/",
      "https://www.amwell.com/",
     " https://www.eka.care/",
     "https://www.docgenie.in/",
     "https://www.narayanahealth.org/",
     "https://healthfirstcenter.in/",
     "https://navedahealthcare.com/",
     "https://www.apollo247.com/"
    ];
     const CurrentPageUrl = page.url()
     console.log("Log the current page url", CurrentPageUrl)
     const validate = thirdPartyDoctorSites.find((site)=> CurrentPageUrl.includes(site))
     if(validate && validate !== undefined)
     {
      return { thirdParty:true, link:CurrentPageUrl}
     }
    // Final check for booking options
    const result = await page.evaluate(() => {
      const hasForm = !!document.querySelector('form[action*="book"]:not([action*="facebook"]), form[action*="formResponse"],form[action*="schedule"], form[action*="reserve"], form[action*="appointment"], form[action*="consult"], form[action*="register"]');
      const hasTimeslot = !!(
          document.querySelector('.time-slot:not([class*="hidden"]), [class*="time-slot"]:not([class*="hidden"]), [class*="timeslot"]:not([class*="hidden"]), [id*="timeslot"]:not([class*="hidden"]), .appointment-time:not(.hidden), [class*="available-time"]:not(.hidden)') ||
          document.querySelector('.slot-available:not(.hidden),li.holdAppointment input[type="radio"], [class*="available-slot"]:not(.hidden), [class*="slot-available"]:not(.hidden), [class*="time-slot-available"]:not(.hidden), [class*="slot-open"]:not(.hidden), [class*="appointment-slot"]:not(.hidden)')
        );
      return { hasForm, hasTimeslot };
    });

    return result;

  } catch (error) {
    console.error(`Error analyzing ${url}:`, error);
    return { error: "Failed to analyze booking options" };
  } finally {
    await browser.close();
  }
};

