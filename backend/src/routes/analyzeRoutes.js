import { Router } from "express";
import { getAnalysis } from "../controllers/analyzeControllers.js";
import { ensureAdmin } from "../middlewares/userMiddleware.js";
import { getgmbanalyze } from "../controllers/gmbanalyzeController.js";
const analyzeRouter = Router();

analyzeRouter.post("/analyze", ensureAdmin, getAnalysis);
analyzeRouter.post("/analyze/gmb", getgmbanalyze);

export default analyzeRouter;
