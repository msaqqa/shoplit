"use server";

import { actionWrapper } from "@/lib/action-wrapper";
import { validateAdmin, validateUser } from "@/lib/auth/guards";
import { AppError } from "@/lib/error/route-error-handler";
import { prisma } from "@/lib/prisma";
import { OrderFormInputs, orderFormSchema } from "@/lib/schemas/orders";
import { revalidatePath } from "next/cache";

// Create order
export async function createOrder(data: OrderFormInputs) {
  await validateUser();
  return actionWrapper(async () => {
    const validations = orderFormSchema.safeParse(data);
    if (!validations.success) {
      const errorMessage = validations.error.issues[0].message;
      throw new AppError(errorMessage || "Invalid order data.", 400);
    }
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

// Update order
export async function updateOrder(id: number, data: OrderFormInputs) {
  await validateAdmin();
  return actionWrapper(async () => {
    const validations = orderFormSchema.safeParse(data);
    if (!validations.success) {
      const errorMessage = validations.error.issues[0].message;
      throw new AppError(errorMessage || "Invalid order data.", 400);
    }
    const response = await prisma.order.update({
      where: { id },
      data: {
        userId: data.userId,
        email: data.email,
        amount: data.amount,
        status: data.status,
        products: {
          deleteMany: {},
          create: data.products,
        },
      },
    });
    revalidatePath("/admin/orders");
    return { data: response, message: "Order updated successfully." };
  });
}

// Get orders
export async function getOrders({
  id,
  limit,
}: { id?: number; limit?: number } = {}) {
  await validateUser();
  return actionWrapper(async () => {
    const response = await prisma.order.findMany({
      where: { id },
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
  await validateAdmin();
  return actionWrapper(async () => {
    if (!id) {
      throw new AppError("Order id is required.", 400);
    }
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) throw new AppError("Order not found.", 404);

    const response = await prisma.order.delete({
      where: { id },
    });
    revalidatePath("/admin/orders");
    return { data: response, message: "Order has been deleted successfully." };
  });
}
