import { Router } from "express";
import { getAnalysis } from "../controllers/analyzeControllers.js";
import { ensureAdmin } from "../middlewares/userMiddleware.js";
import { getGMBAnalyze } from "../controllers/gmbanalyzeController.js";
import { getGMBData } from "../controllers/extarctData.js";
const analyzeRouter = Router();

analyzeRouter.post("/analyze", ensureAdmin, getAnalysis);
analyzeRouter.post("/analyze/gmb", getGMBAnalyze);
analyzeRouter.post("/analyze/url", getGMBData);

export default analyzeRouter;
