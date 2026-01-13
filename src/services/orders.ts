import { prisma } from "@/lib/prisma";
import { api } from "./api";
import { TOrderProduct } from "@/types/orders";

export async function getOrders({ limit }: { limit?: number | undefined }) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: true,
        user: true,
      },
      take: limit || undefined,
    });
    return orders;
  } catch (error) {
    throw error;
  }
}

export const payOrder = async (data: {
  userId: number;
  products: TOrderProduct[];
  amount: number;
  email: string;
}) => {
  try {
    const res = await api.post("/stripe/create-payment-intent", data);
    return await res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchOrderChart = async () => {
  try {
    const res = await api.get("/orders");
    return res.data;
  } catch (error) {
    throw error;
  }
};
