"use server";

import { prisma } from "@/lib/prisma";
import { OrderFormInputs } from "@/types/orders";
import { revalidatePath } from "next/cache";

// create order
export async function createOrder(data: OrderFormInputs) {
  try {
    await prisma.order.create({
      data: {
        userId: data.userId,
        email: data.email,
        amount: data.amount,
        status: data.status as any,
        products: {
          create: data.products,
        },
      },
    });
    revalidatePath("/admin/orders");
  } catch (error) {
    throw error;
  }
}

// delete order
export async function deleteOrder(id: number) {
  const order = await prisma.order.findUnique({
    where: { id },
  });
  if (!order) return;
  await prisma.order.delete({
    where: { id },
  });
  revalidatePath("/admin/orders");
}
