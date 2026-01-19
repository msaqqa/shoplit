"use server";

import { actionWrapper } from "@/lib/action-wrapper";
import { prisma } from "@/lib/prisma";
import { OrderFormInputs } from "@/types/orders";
import { revalidatePath } from "next/cache";

// create order
export async function createOrder(data: OrderFormInputs) {
  return actionWrapper(async () => {
    await prisma.order.create({
      data: {
        userId: data.userId,
        email: data.email,
        amount: data.amount,
        status: data.status,
        products: {
          create: data.products,
        },
      },
    });
    revalidatePath("/admin/orders");
  });
}

export async function getOrders({ limit }: { limit?: number | undefined }) {
  return actionWrapper(async () => {
    const response = await prisma.order.findMany({
      include: {
        products: true,
        user: true,
      },
      take: limit || undefined,
    });
    return response;
  });
}

// delete order
export async function deleteOrder(id: number) {
  return actionWrapper(async () => {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) return;

    await prisma.order.delete({
      where: { id },
    });
    revalidatePath("/admin/orders");
    return order;
  });
}
