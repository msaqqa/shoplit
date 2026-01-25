import { z } from "zod";

// Category schema
export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  slug: z.string().min(1, "Slug is required!"),
  icon: z.string().min(1, "Icon is required!"),
});

// Exporting schema types
export type CategoryFormInputs = z.infer<typeof categoryFormSchema>;
