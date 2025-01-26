import * as cheerio from "cheerio";
import axios from "axios";
import { buttonNames } from "../utils/buttonArray.js";
export const getCheerioInsight = async (url) => {
  try {
    //Fetch the website content (use puppeteer for dynamic content)
    //const html = await fetchDynamicContent(url);
    // // Fetch the website content
    const response = await axios.get(url, {
      timeout: 15000, //Increase timeout to 15 seconds
    });
    const html = response.data;
    //Parse html with cheerio
    const $ = cheerio.load(html);
    console.log("Logging loaded html from cheerio", $);
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
      linkedin: $('a[href*="linkedin.com"]').attr("href") || null,
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

    //Check all button and links for "Book Appoinment"
    let hasBookAppoinment = false;
    $("button, a").each((index, element) => {
      const text = $(element).text().toLowerCase().trim();
      const ariaLabel = $(element).attr("aria-label")?.toLowerCase() || "";
      const title = $(element).attr("title")?.toLowerCase() || "";
      if (
        buttonNames.some((buttonName) => {
          const regex = new RegExp(`\\b${buttonName}\\b`, "i");
          return regex.test(text) || regex.test(ariaLabel) || regex.test(title);
        })
      ) {
        hasBookAppoinment = true;
        return false; //break the loop
      }
    });

    //check if the website contains blogs
    const blogContainers = $("article, .post, .blog-post, .entry, .blog-item");
    const blogCount = blogContainers.length;
    //If blogs are found. extract their titles and authors
    const blogs = [];
    if (blogCount > 0) {
      blogContainers.each((index, element) => {
        const title =
          $(element)
            .find("h1, h2, .post-title, .entry-title, .blog-title")
            .text()
            .trim() || "No Title Found";

        const author =
          $(element)
            .find(".author, .post-author, .entry-author, [itemprop='author]")
            .text()
            .trim() || "unknown Author";
        blogs.push({ title, author });
      });
    }
    //Analyze the extracted data
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
      hasBookAppoinment,
      blogInfo: {
        hasBlogs: blogCount >0,
        blogCount,
        blogs
        
      },
      ariaAttributes, //This for accessiblity
    };

    // console.log(analysis);
    return analysis;
  } catch (error) {
    console.log("Error Extracting data by Cheerio", error);
    throw error;
  }
};
