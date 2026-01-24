import { api } from "./api";
import { TOrderProduct } from "@/types/orders";

export const payOrder = async (data: {
  userId: number;
  products: TOrderProduct[];
  amount: number;
  email: string;
}) => {
  const response = await api.post("/stripe/create-payment-intent", data, {
    showNotification: false,
  });
  return await response.data;
};

export const fetchOrderChart = async () => {
  const response = await api.get("/orders");
  return response.data;
};
