import {
  saveReport,
  getParameteres,
  getActiveParameters,
  checkUrlExits,
  addUserUrl,
  addSuggestionTOUrl,
} from "../services/actions.js";
import { urlSchema } from "../utils/types.js";
import { z } from "zod";
import getPageSpeedInsights from "../services/pageSpeedService.js";
import { extractPageSpeedData } from "../utils/extractors.js";
import { getCheerioInsight } from "../services/cheerioService.js";
import { getGeminiApiInsight } from "../services/geminiApiService.js";
import { cheerioInsightScores } from "../utils/scoreCalculator.js";
import { mapDataToParameter } from "../utils/mapData.js";
import { mapDataToActiveParameter } from "../utils/mapDataActive.js";

export const getAnalysis = async (req, res) => {
  try {
    const { url } = urlSchema.parse(req.body);
    console.log(url);
    let user;
    console.log(req.user);
    let Url;
    if (req.user) {
      user = req.user;
      //link User-Url
      Url = await addUserUrl(user, url);
      //   console.log(Url);
    }

    const websiteUrl = Url.url;

    //check if data for this url is already available return report   ?Add constrain that fetched report date
    const existingUrl = await checkUrlExits(url);
    //Get the active parameter
    const activeParameter = await getActiveParameters();
    //data exits for Url
    if (existingUrl.report) {
      const result = mapDataToActiveParameter(
        activeParameter,
        existingUrl.report.data
      );
      const suggestion = existingUrl.suggestion?.data;
      return res.status(200).json({
        message: "URL analysis finished. See results below ©",
        websiteUrl,
        result,
        suggestion,
      });
    }

    //fetch data from cheerio
    const cheerioInsight = await getCheerioInsight(url);
    //fetch cheerio insight scores
    const cheerioInsightData = cheerioInsightScores(cheerioInsight);
    //Fetch page insights
    const pageSpeedInsight = await getPageSpeedInsights(url);
    //Fetch extracted page Insight Response
    const pageSpeedInsightData = extractPageSpeedData(pageSpeedInsight);
    //Combine cheerioInsight and pageInsight data in one object
    const auditData = { ...pageSpeedInsightData, ...cheerioInsightData };
    //get all parameter
    const parameters = await getParameteres();
    //mapping data to their respective  parameter field
    const reportData = mapDataToParameter(parameters, auditData);
    //save  reportdata for Url
    const report = await saveReport(Url.id, reportData);
    //map report data to active parameter
    const result = mapDataToActiveParameter(activeParameter, report.data);
    // Combine cheerio raw and PageSpeed (extracted) data for suggestion
    const combineData = { ...cheerioInsight, ...pageSpeedInsightData };
    //get suggestion from gemini api
    const geminiSuggestion = await getGeminiApiInsight(combineData);
    //save suggestion for Url
    const suggestion = await addSuggestionTOUrl(Url.id, geminiSuggestion);
    //Url
    // Return the response
    return res.status(200).json({
      message: "URL analysis finished. See results below",
      websiteUrl,
      result,
      suggestion,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }
    return res.status(500).json({
      message: `Failed to fetch the website. Please check the URL ${error.message}`,
    });
  }
};
