import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must contain atleast 2 charcter")
  .max(20, "Username can not exceed more than 20 character")
  .regex(
    /^[a-zA-z0-9_]+$/,
    "Invalid username, it can not contain the special character",
  );

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email Address" }),
  password: z.string().min(6, "Password must contain 6 charcter"),
});
