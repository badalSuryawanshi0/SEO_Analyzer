import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const PAGE_SPEED_URL = process.env.PAGE_SPEED_URL;
const apikey = process.env.PAGESPEED_API_KEY;
if (!PAGE_SPEED_URL || !apikey) {
  throw new Error(
    "Missing required environment variables: PAGE_SPEED_URL or PAGESPEED_API_KEY"
  );
}
const getPageSpeedInsights = async (url) => {
  console.log(`Fetching PageSpeed Insights for ${url}`);
  try {
    const response = await axios.get(PAGE_SPEED_URL, {
      params: {
        url: url,
        key: apikey,
        strategy: "mobile",
      },
      timeout: 60000,
    });

    return response.data;
  } catch (error) {
    console.log("Error fetching PageSpeed Insights:", error.message);
    if (error.response) {
      if (error.response.status === 429) {
        throw new Error("PageSpeed Insights API rate limit reached");
      } else {
        throw new Error(
          `API error: ${error.response.status}- ${error.response.statusText}`
        );
      }
    } else if (error.request) {
      throw new Error("No response received from PageSPeed Insight API");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Timeout occurred while fetching PageSpeed data");
    } else {
      throw new Error(`Unexpected error: ${error.message}`);
    }
  }
};

export default getPageSpeedInsights;
