import { z } from "zod";

const PASSWORD_LENGTH = 4;

const loginSchema = z.object({
  email: z.email("Email is required"),
  password: z
    .string()
    .min(
      PASSWORD_LENGTH,
      `Password must have atleast ${PASSWORD_LENGTH} character`,
    ),
});

const registerSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Enter the 6-digit code")
    .regex(/^\d+$/, "Code must be numeric"),
});

export { loginSchema, registerSchema, otpSchema };
