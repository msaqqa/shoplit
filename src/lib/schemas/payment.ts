import { z } from "zod";

// Payment schema
export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  email: z.email().min(1, "Email is required!"),
  phone: z.string().min(7, "Phone number must be contains 7 digits!"),
  address: z.string().min(1, "Address is required!"),
  city: z.string().min(1, "City is required!"),
});

// Exporting schema types
export type TShippingFormInputs = z.infer<typeof shippingFormSchema>;
