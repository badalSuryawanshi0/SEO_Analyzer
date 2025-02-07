import Bull from "bull";
import getPageSpeedInsights from "../services/pageSpeedService.js";
import { extractPageSpeedData } from "../utils/extractors.js";
import { getCheerioInsight } from "../services/cheerioService.js";
import { getGeminiApiInsight } from "../services/geminiApiService.js";
import { cheerioInsightScores } from "../utils/scoreCalculator.js";
import { mapDataToParameter } from "../utils/mapData.js";
import { mapDataToActiveParameter } from "../utils/mapDataActive.js";
import {
  saveReport,
  getParameteres,
  getActiveParameters,
  checkUrlExits,
  addUserUrl,
  addSuggestionTOUrl,
} from "../services/actions.js";

//Create a Bull queue
const analysisQueue = new Bull("analysisQueue");
