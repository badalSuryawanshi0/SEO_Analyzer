import express from "express";
import cors from "cors";
import paramRouter from "./src/routes/paramRoutes.js";
import dotenv from "dotenv";
import analyzeRouter from "./src/routes/analyzeRoutes.js";
import authRouter from "./src/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
dotenv.config();

const app = express();
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, //Allow three req in 15min window
  max: 15,
  message: {
    status: 429,
    message: "Too many requests, please try again after 15 minutes",
  },
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //Allow credentials (cookies)
  })
);
app.use(limiter);

app.use("/api", authRouter);
app.use("/api", analyzeRouter);
app.use("/api", paramRouter);
export default app;
