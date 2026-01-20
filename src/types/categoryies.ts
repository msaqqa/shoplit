import { z } from "zod";

export type TCategory = {
  id: number;
  name: string;
  icon: string;
  slug: string;
};

export type TCategories = TCategory[];

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  slug: z.string().min(1, "Slug is required!"),
  icon: z.string().min(1, "Icon is required!"),
});

export type CategoryFormInputs = z.infer<typeof categoryFormSchema>;
