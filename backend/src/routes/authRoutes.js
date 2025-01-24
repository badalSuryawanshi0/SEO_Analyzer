import { Router } from "express";
const authRouter = Router();
import { adminLogin, registerAdmin } from "../controllers/authController.js";
authRouter.post("/signup", registerAdmin);
authRouter.post("/signin", adminLogin);
export default authRouter;
