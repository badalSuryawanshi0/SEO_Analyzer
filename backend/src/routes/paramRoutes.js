import { Router } from "express";
import {
  createParam,
  getParams,
  getUpdatedParameters,
} from "../controllers/parameterController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const paramRouter = Router();

paramRouter.post("/v1/param", authMiddleware, createParam);
paramRouter.get("/v1/param", authMiddleware, getParams);
paramRouter.patch("/v1/param", authMiddleware, getUpdatedParameters);
export default paramRouter;
