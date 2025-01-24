import { z } from "zod";
export const AdminSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 character"),
});
export const urlSchema = z.object({
  url: z.string().url("Invalid URL format").min(1, "URL is required"),
});
export const parameterSchema = z.object({
  name: z.string().min(1, "Name Required"),
  type: z.string().min(1, "Type Required"),
  field: z.string().min(1, "Field Required"),
});
//ensure atleast one field is provided
export const parameterUpdateSchema = z
  .object({
    name: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => data.name !== undefined || data.isActive !== undefined, {
    message: "At least one of 'name' or 'isActive' is required",
  });
