import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createAnonymousUser, getUser } from "../services/actions.js";
dotenv.config();

const SECRET = process.env.SECRET;
export const ensureAdmin = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;
    const token = authHeaders && authHeaders.split(" ")[1];
    if (token) {
      jwt.verify(token, SECRET, (error, decoded) => {
        if (error) {
          return res.status(400).json({
            message: "Invalid token",
          });
        }
        req.user = decoded;
        //check if the user is admin
        if (req.user.isAdmin !== true) {
          return res.status(403).json({
            message: "Access denied. User is not an admin",
          });
        }
        return next();
      });
    } else {
      const anonymousId = req.cookies?.id || null;
      console.log("Got the the id from cookie", anonymousId);
      if (anonymousId) {
        const user = await getUser(anonymousId);
        req.user = user;
      }
      //Create new anonymous user and set cookies
      else {
        const user = await createAnonymousUser();
        res.cookie("id", user.id, {
          httpOnly: true,
          secure: false, //Set this true in production
          maxAge: 1 * 24 * 60 * 60 * 1000, //1 day
        });
        req.user = user;
      }
      return next();
    }
  } catch (error) {
    console.log("Error in userMiddleware", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
