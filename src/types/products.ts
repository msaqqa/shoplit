import { z } from "zod";
import { TCategory } from "./categoryies";
import { colors, sizes } from "@/constants/products";

export type TProduct = {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: Record<string, string>;
  categoryId: number;
  category?: TCategory;
};

export type TProducts = TProduct[];
export type TProductForm = Omit<TProduct, "id">;
export type TProductFormEdit = Partial<TProductForm>;

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

export type ProductFormInputs = z.infer<typeof productFormSchema>;

export type TProductsParams = {
  categoryId?: string;
  sort?: "newest" | "oldest" | "asc" | "desc";
  search?: string;
  params?: "homePage" | "products" | "popularProducts";
};
