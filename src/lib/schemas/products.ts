import { z } from "zod";
import { colors, sizes } from "@/constants/products";

// Product schema
export const productFormSchema = z.object({
  name: z.string().min(1, { message: "Product name is required!" }),
  shortDescription: z
    .string()
    .min(1, { message: "Short description is required!" })
    .max(60),
  description: z.string().min(1, { message: "Description is required!" }),
  price: z.number().min(1, { message: "Price is required!" }),
  categoryId: z.number(),
  sizes: z.array(z.enum(sizes)),
  colors: z.array(z.enum(colors)),
  images: z.record(z.string(), z.string()),
});

// Exporting schema types
export type ProductFormInputs = z.infer<typeof productFormSchema>;
