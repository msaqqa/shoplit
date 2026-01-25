import { z } from "zod";

// Schema for creating a new user
export const userFormSchema = z.object({
  name: z.string().min(1, { message: "User name is required!" }),
  password: z.string().min(1, { message: "password is required!" }),
  email: z.email().min(1, "Email is required!"),
  avatar: z.string().optional(),
});

// Schema for updating an existing user
export const updateUserSchema = userFormSchema.omit({
  password: true,
});

// Exporting schema types
export type UserFormInputs = z.infer<typeof userFormSchema>;
export type UserUpdateInputs = z.infer<typeof updateUserSchema>;
