import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const geminiApiKey = process.env.GEMINI_API_KEY;
export const getGeminiApiInsight = async (data) => {
  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const dataJson = JSON.stringify(data, null, 2);
    const prompt = `You are an expert SEO analyst. You will be provided with website data extracted using Cheerio and PageSpeed, including title, meta-tags, headings (h1 and h2), internal and external links, social links, social media meta tags (og:title and og:description), performance score, loading experience, and mobile friendliness.

Analyze this data and provide a brief recommendation for each relevant SEO element, highlighting strengths and weaknesses.

Respond in JSON format with the following structure:

{
  "title": {
    "recommendation": "Recommendation for the title based on its SEO effectiveness."
  },
  "metaTags": {
    "description": {
      "recommendation": "Recommendation for the meta description based on its SEO effectiveness."
    },
    "keywords": {
      "recommendation": "Recommendation for the meta keywords based on its SEO effectiveness."
    },
    "social": {
      "recommendation": "Recommendation for og:title and og:description based on their SEO effectiveness."
    }
  },
  "headings": {
    "h1": {
      "recommendation": "Recommendation for the h1 heading based on its SEO effectiveness."
    },
    "h2": {
      "recommendation": "Recommendation for the h2 heading based on its SEO effectiveness."
    }
  },
  "links": {
    "internal": {
      "recommendation": "Recommendation for the internal links based on their SEO effectiveness."
    },
    "external": {
      "recommendation": "Recommendation for the external links based on their SEO effectiveness."
    }
  },
  "performanceScore": {
    "recommendation": "Recommendation based on the performance score (e.g., optimize loading time, reduce file sizes)."
  },
  "loadingExperience": {
    "recommendation": "Recommendation based on the loading experience (e.g., improve user experience on slower connections)."
  },
  "originLoadingExperience": {
    "recommendation": "Recommendation based on the origin loading experience (e.g., optimize server response time)."
  },
  "mobileFriendliness": {
    "recommendation": "Recommendation for improving mobile friendliness (e.g., optimize layout for smaller screens)."
  }
}

Here is the Cheerio and PageSpeed data for analysis:
json
${dataJson}`;
    const result = await model.generateContent([prompt]);
    const response = result?.response || "No content generated";
    const text = response.text();
    const sanitizedText = text.replace(/```json|```/g, "").trim();
    const parsedResult = JSON.parse(sanitizedText);
    return parsedResult;
  } catch (error) {
    console.log("Error generating content:", error);
    throw new Error("Suggestion Generation Error");
  }
};
