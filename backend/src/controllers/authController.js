import { existingUser, createAdmin } from "../services/actions.js";
import { z } from "zod";
import { AdminSchema } from "../utils/types.js";
export const registerAdmin = async (req, res) => {
  try {
    const admin = AdminSchema.parse(req.body);
    await createAdmin(admin);
    return res.status(200).json({
      message: "Admin created Sucessfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const adminLogin = async (req, res) => {
  try {
    const admin = req.body;
    const response = await existingUser(admin);
    return res.status(200).json({
      message: "Login successful",
      token: response,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(200).json({
        message: error.errors[0].message,
      });
    }
    return res.status(500).json({
      message: error.message,
    });
  }
};
