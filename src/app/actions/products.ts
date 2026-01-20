"use server";

import { prisma } from "@/lib/prisma";
import { ProductFormInputs, TProductsParams } from "@/types/products";
import { revalidatePath } from "next/cache";
import { deleteImageFromCloudinary } from "./delete-image";
import { actionWrapper } from "@/lib/action-wrapper";

export async function createProduct(data: ProductFormInputs) {
  return actionWrapper(async () => {
    await prisma.product.create({
      data: {
        ...data,
        categoryId: Number(data.categoryId),
      },
    });
    revalidatePath("/admin/products");
  });
}

export async function getProducts({
  categoryId,
  sort,
  search,
  params,
}: TProductsParams = {}) {
  return actionWrapper(async () => {
    const response = await prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId: Number(categoryId) }),
        ...(search && { name: { contains: search } }),
      },
      orderBy:
        sort === "newest"
          ? { id: "desc" }
          : sort === "oldest"
            ? { id: "asc" }
            : sort === "asc"
              ? { price: "asc" }
              : sort === "desc"
                ? { price: "desc" }
                : undefined,
      take:
        params === "homePage"
          ? 8
          : params === "popularProducts"
            ? 5
            : undefined,
      include: {
        category: true,
      },
    });
    return response;
  });
}

export async function geTProductByID(id: number) {
  return actionWrapper(async () => {
    return await prisma.product.findUnique({
      where: { id },
    });
  });
}

// app/actions/products.ts
// export async function updateProduct(id: number, data: TProductFormEdit) {
//   await prisma.product.update({
//     where: { id },
//     data: {
//       ...data,
//       categoryId: data.categoryId !== undefined ? Number(data.categoryId) : undefined,
//     },
//   });
//   revalidatePath("/admin/products");
// }

export async function deleteProduct(id: number) {
  return actionWrapper(async () => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return;

    if (product.images) {
      const images = product.images as Record<string, string>;
      for (const color in images) {
        if (images[color]) await deleteImageFromCloudinary(images[color]);
      }
    }
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
  });
}
