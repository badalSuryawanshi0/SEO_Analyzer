import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
//middleware for JWT authentication
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(409).json({
        message: "Access denied. No token provided",
      });
    }
    //verify the token
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      //Attach user data to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
