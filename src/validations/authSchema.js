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

export { loginSchema };
