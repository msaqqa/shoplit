import { z } from "zod";
import { TUser } from "./users";

export type TOrderProduct = {
  id?: number;
  name: string;
  quantity: number;
  price: number;
};

export type TOrder = {
  id: number;
  userId: number;
  email: string;
  amount: number;
  status: "success" | "failed";
  products: TOrderProduct[];
  createdAt: Date;
  updatedAt: Date;
  user?: TUser;
};

export type TOrders = TOrder[];

export type TOrderChart = {
  month: string;
  total: number;
  successful: number;
};

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be at least 0"),
});

export const orderFormSchema = z.object({
  userId: z.number(),
  email: z.email().min(1, "Email is required!"),
  amount: z.number().min(1, "Amount must be at least 1"),
  status: z.enum(["pending", "processing", "success", "failed"]),
  products: z.array(productSchema).min(1, "At least 1 product is required"),
});

export type OrderFormInputs = z.infer<typeof orderFormSchema>;
