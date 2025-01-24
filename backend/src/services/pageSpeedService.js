import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const PAGE_SPEED_URL = process.env.PAGE_SPEED_URL;
const apikey = process.env.PAGESPEED_API_KEY;
//we can use strategy as parameter to get both mobile and desktop speed
const getPageSpeedInsights = async (url) => {
  console.log(url);
  try {
    const response = await axios.get(PAGE_SPEED_URL, {
      params: {
        url: url,
        key: apikey,
        strategy: "mobile",
      },
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.log("Error fetching PageSpeed Insights:", error.message);
    if (error.response && error.response.status === 429) {
      // Handle rate limiting error
      throw new Error("PageSpeed Insights API rate limit reached");
    } else {
      // Re-throw the original error
      throw new Error("Timeout occurred while fetching PageSpeed data");
    }
  }
};
export default getPageSpeedInsights;
