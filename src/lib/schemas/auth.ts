import { z } from "zod";

// Signin schema
export const signinSchema = z.object({
  email: z.email().min(1, "Email is required!"),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

// Login user schema
export const loginUserSchema = signinSchema.omit({
  rememberMe: true,
});

// Base signup schema
export const baseSignupSchema = z.object({
  name: z.string().min(1, { message: "User name is required!" }),
  email: z.email().min(1, "Email is required!"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contains number, uppercase, lowercase and special character",
    ),
  avatar: z.string().optional(),
});

// Signup schema
export const signupSchema = baseSignupSchema
  .extend({
    confirmPassword: z.string(),
    accept: z.boolean().refine((val) => val === true, {
      message: "Please agree to the privacy policy to continue.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// export const signupSchema = z
//   .object({
//     name: z.string().min(1, { message: "User name is required!" }),
//     email: z.email().min(1, "Email is required!"),
//     password: z
//       .string()
//       .regex(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
//         "Password must contains uppercase, lowercase and special character",
//       ),
//     confirmPassword: z.string(),
//     accept: z.boolean().refine((val) => val === true, {
//       message: "Please agree to the privacy policy to continue.",
//     }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match.",
//     path: ["confirmPassword"],
//   });

// Forget password schema
export const forgetPasswordSchema = z.object({
  email: z.email().min(1, "Email is required!"),
});

// Verify otp schema
export const verifyOtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Should be exactly 6 digits long"),
});

// Verify otp server schema
export const verifyOtpServerSchema = z.object({
  ...forgetPasswordSchema,
  ...verifyOtpSchema,
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must contains number, uppercase, lowercase and special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Reset password server schema
export const resetPasswordServerSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contains number, uppercase, lowercase and special character",
    ),
  email: z.email().min(1, "Email is required!"),
  token: z.string(),
});

// Exporting schema types
export type TSigninSchema = z.infer<typeof signinSchema>;
export type TSignupSchema = z.infer<typeof signupSchema>;
export type TForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;
export type TVerifyOtpSchema = z.infer<typeof verifyOtpSchema>;
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
