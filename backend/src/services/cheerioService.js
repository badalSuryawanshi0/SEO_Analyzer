import * as cheerio from "cheerio";
import axios from "axios";
export const getCheerioInsight = async (url) => {
  try {
    // Fetch the website content
    const response = await axios.get(url, {
      timeout: 15000, //Increase timeout to 15 seconds
    });
    const html = response.data;
    //Parse html with cheerio
    const $ = cheerio.load(html);

    //extract relevant data
    //meta-tags
    const title = $("title").text();
    const metaKeywords = $('meta[name="keywords"]').attr("content") || null;
    // const viewport = $('meta[name="viewport"]').attr("content") || null;
    const metaDescription =
      $('meta[name="description"]').attr("content") || null;
    const socialMetaTags = {
      ogTitle: $('meta[property="og:title"]').attr("content") || null,
      ogDescription:
        $('meta[property="og:description"]').attr("content") || null,
    };
    // social media links
    const socialMediaLinks = {
      facebook: $('a[href*="facebook.com"]').attr("href") || null,
      twitter: $('a[href*="twitter.com"]').attr("href") || null,
      linkedin: $('a[href*="linkdin.com"]').attr("href") || null,
      instagram: $('a[href*="facebook.com"]').attr("href") || null,
    };
    //Accessibility
    const ariaAttributes = $("[aria-label],[aria-describedby], [aria-hidden]")
      .map((index, el) => ({
        tag: el.tagName,
        ariaLabel: $(el).attr("aria-label") || null,
        ariaDescribedby: $(el).attr("aria-describedby") || null,
        ariaHidden: $(el).attr("aria-hidden") || null,
      }))
      .get();

    const headings = {
      h1: $("h1")
        .map((index, el) => $(el).text())
        .get(), //Retrieve all elements matched by the Cheerio, as an array.
      h2: $("h2")
        .map((index, el) => $(el).text())
        .get(),
    };
    const links = $("a")
      .map((index, el) => $(el).attr("href"))
      .get()
      .filter((link) => link);

    const analysis = {
      title: title || null,
      metaTags: {
        description: metaDescription || null,
        keywords: metaKeywords || null,
        social: socialMetaTags || null,
      },
      headings,
      links: {
        external: links.filter((link) => link && !link.startsWith("/")),
        internal: links.filter((link) => link && link.startsWith("/")),
      },
      social: socialMediaLinks,
      ariaAttributes, //This for accessiblity
    };

    console.log(analysis);
    return analysis;
  } catch (error) {
    console.log("Error Extracting data by Cheerio", error);
    throw error;
  }
};
