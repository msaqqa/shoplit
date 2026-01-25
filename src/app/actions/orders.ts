"use server";

import { actionWrapper } from "@/lib/action-wrapper";
import { AppError } from "@/lib/error/route-error-handler";
import { prisma } from "@/lib/prisma";
import { OrderFormInputs } from "@/lib/schemas/orders";
import { revalidatePath } from "next/cache";

// Create order
export async function createOrder(data: OrderFormInputs) {
  return actionWrapper(async () => {
    const response = await prisma.order.create({
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
    return { data: response, message: "Order placed successfully." };
  });
}

// Get orders
export async function getOrders({ limit }: { limit?: number | undefined }) {
  return actionWrapper(async () => {
    const response = await prisma.order.findMany({
      include: {
        products: true,
        user: true,
      },
      take: limit || undefined,
    });
    return { data: response };
  });
}

// Delete order
export async function deleteOrder(id: number) {
  return actionWrapper(async () => {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) throw new AppError("Order not found.", 404);

    await prisma.order.delete({
      where: { id },
    });
    revalidatePath("/admin/orders");
    return { data: order, message: "Order has been deleted successfully." };
  });
}
