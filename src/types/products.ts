import { TCategory } from "./categoryies";

// Product type
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

// Products data type
export type TProducts = TProduct[];
export type TProductForm = Omit<TProduct, "id">;
export type TProductFormEdit = Partial<TProductForm>;

// Products params type
export type TProductsParams = {
  categoryId?: string;
  sort?: "newest" | "oldest" | "asc" | "desc";
  search?: string;
  params?: "homePage" | "products" | "popularProducts";
};
