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
import { client } from "../config/redisClient.js";
export const getAnalysis = async (req, res) => {
  try {
    const { url } = urlSchema.parse(req.body);
    let user;
    let Url;
    if (req.user) {
      user = req.user;
      //link User-Url
      Url = await addUserUrl(user, url);
      console.log("Loggin url Data", Url);
    }

    const websiteUrl = Url?.url;

    //check if data for this url is already available return report
    const existingUrl = await checkUrlExits(url);
    //Get the active parameter
    const activeParameter = await getActiveParameters();

    //data exits for Url
    if (existingUrl?.report) {
      const cacheResult = await client.get(`${websiteUrl}:result`);
      const cacheSuggestion = await client.get(`${websiteUrl}:suggestion`);
      if (cacheResult && cacheSuggestion) {
        const suggestion = JSON.parse(cacheSuggestion);

        console.log("Redis cache Result", cacheResult);

        const result = mapDataToActiveParameter(
          activeParameter,
          JSON.parse(cacheResult)
        ); // map redis-data parameters to active parameter
        return res.status(200).json({
          message: "URL analysis finished. See results below ©",
          websiteUrl,
          result,
          suggestion,
        });
      }
      const result = mapDataToActiveParameter(
        activeParameter,
        existingUrl.report?.data
      );
      //set data in redis for further req
      await client.set(
        `${websiteUrl}:result`,
        JSON.stringify(existingUrl.report?.data)
      );

      const suggestion = existingUrl.suggestion?.data;
      await client.set(`${websiteUrl}:suggestion`, JSON.stringify(suggestion));
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
    let parameters;
    //get all parameter from redis if available
    const getparameters = await client.get("parameters");
    parameters = JSON.parse(getparameters);

    if (!parameters) {
      parameters = await getParameteres();
      console.log("Got parameter from db");
    }
    //Parameter are pre-configure so we can store this in redis
    await client.set("parameters", JSON.stringify(parameters));
    //mapping data to their respective  parameter field
    const reportData = mapDataToParameter(parameters, auditData);
    console.log("Mapping data to parameters", reportData);
    //save  reportdata for Url
    console.log(Url?.id);
    const report = await saveReport(Url.id, reportData);
    //map report data to active parameter
    const result = mapDataToActiveParameter(activeParameter, report.data);
    console.log("Mapping data to active Parameter", result);
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
