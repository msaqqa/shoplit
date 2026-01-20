import { z } from "zod";
import { TCategory } from "./categoryies";

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

const colors = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "gray",
  "black",
  "white",
] as const;

const sizes = [
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
] as const;

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
