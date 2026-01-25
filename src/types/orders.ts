import { TUser } from "./users";

// Order product type
export type TOrderProduct = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

// Order type
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

// Orders data type
export type TOrders = TOrder[];

// Orde chart type
export type TOrderChart = {
  month: string;
  total: number;
  successful: number;
};
