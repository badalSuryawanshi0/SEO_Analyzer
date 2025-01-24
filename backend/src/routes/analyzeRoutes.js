import { Router } from "express";
import { getAnalysis } from "../controllers/analyzeControllers.js";
import { ensureAdmin } from "../middlewares/userMiddleware.js";
const analyzeRouter = Router();

analyzeRouter.post("/analyze", ensureAdmin, getAnalysis);

export default analyzeRouter;
