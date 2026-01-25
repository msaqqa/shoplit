import { z } from "zod";

// Product schema within an order
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be at least 0"),
});

// Order schema
export const orderFormSchema = z.object({
  userId: z.number(),
  email: z.email().min(1, "Email is required!"),
  amount: z.number().min(1, "Amount must be at least 1"),
  status: z.enum(["success", "failed"]),
  products: z.array(productSchema).min(1, "At least 1 product is required"),
});

// Exporting schema types
export type OrderFormInputs = z.infer<typeof orderFormSchema>;
