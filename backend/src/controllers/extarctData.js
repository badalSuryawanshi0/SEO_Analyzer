import puppeteer from "puppeteer";

export const extractData = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  console.log("Analyzing booking options for:", url);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    const initialCheck = await page.evaluate(() => {
      const hasForm = !!(
        document.querySelector('form[action*="book"]:not([action*="facebook"]), form[action*="schedule"], form[action*="reserve"]') ||
        document.querySelector('form[action*="slot"], form[action*="appointment"]')
      );

      const hasTimeslot = !!(
        // Time slots and calendar elements
        document.querySelector('.time-slot, [id*="time"], [class*="time"]') ||
        document.querySelector('.calendar, [id*="calendar"], [class*="calendar"]') ||
        document.querySelector('input[type="date"]') ||
        // Specific slot-based selectors from the example
        document.querySelector('[href*="slot/reserve"]') ||
        document.querySelector('[href*="calendar"]') ||
        // Look for time patterns in text content
        document.querySelector('div[class*="slot"], a[class*="slot"]') ||
        // Look for slot availability text
        document.querySelector('div:contains("SLOTS AVAILABLE"), div[class*="slots-available"]') ||
        // Time display elements
        document.querySelector('div[class*="time"]:not([class*="timeline"])') ||
        // Consultation or appointment related elements
        document.querySelector('[href*="consultation"], [class*="consultation"]')
      );

      return { hasForm, hasTimeslot };
    });

    if (initialCheck.hasForm || initialCheck.hasTimeslot) {
      return res.json(initialCheck);
    }

    const buttonFound = await page.evaluate(() => {
      const buttonTexts = ['book appointment', 'schedule meeting', 'reserve slot', 'make appointment', 
                          'book', 'schedule', 'appointment', 'reserve'];
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.some(btn => 
        buttonTexts.some(text => btn.textContent.toLowerCase().includes(text))
      );
    });

    if (!buttonFound) {
      return res.json({ hasForm: false, hasTimeslot: false });
    }

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const buttonTexts = ['book appointment', 'schedule meeting', 'reserve slot', 'make appointment', 
                          'book', 'schedule', 'appointment', 'reserve'];
      const bookButton = buttons.find(btn =>
        buttonTexts.some(text => btn.textContent.toLowerCase().includes(text))
      );
      if (bookButton) bookButton.click();
    });

    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(() => {});
    await delay(2000);

    const result = await page.evaluate(() => {
      const hasForm = !!document.querySelector('form[action*="book"], form[action*="schedule"], form[action*="reserve"]');
      const hasTimeslot = !!(
        document.querySelector('.time-slot, [id*="time"], [class*="time"]') ||
        document.querySelector('.calendar, [id*="calendar"], [class*="calendar"]') ||
        document.querySelector('input[type="date"]') ||
        document.querySelector('a[href*="appointment"]')
      );

      return { hasForm, hasTimeslot };
    });

    return res.json(result);

  } catch (error) {
    console.error(`Error analyzing ${url}:`, error);
    return res.status(500).json({ 
      error: "Failed to analyze booking options",
      details: error.message
    });
  } finally {
    await browser.close();
  }
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}