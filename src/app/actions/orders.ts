"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// create order
export async function createOrder(data) {
  try {
    await prisma.order.create({
      data: {
        ...data,
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
