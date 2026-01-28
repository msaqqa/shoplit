"use server";

import { prisma } from "@/lib/prisma";
import { TProductsParams } from "@/types/products";
import { revalidatePath } from "next/cache";
import { deleteImageFromCloudinary } from "./cloudinary";
import { actionWrapper } from "@/lib/action-wrapper";
import { AppError } from "@/lib/error/route-error-handler";
import { ProductFormInputs } from "@/lib/schemas/products";

export async function createProduct(data: ProductFormInputs) {
  return actionWrapper(async () => {
    const response = await prisma.product.create({
      data: {
        ...data,
        categoryId: Number(data.categoryId),
      },
    });
    revalidatePath("/admin/products");
    return { data: response, message: "Product created successfully." };
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
        ...(search && { name: { contains: search, mode: "insensitive" } }),
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
    return { data: response };
  });
}

export async function geTProductByID(id: number) {
  return actionWrapper(async () => {
    const response = await prisma.product.findUnique({
      where: { id },
    });
    return { data: response };
  });
}

// Update Product
// export async function updateProduct(id: number, data: TProductFormEdit) {
//   const response = await prisma.product.update({
//     where: { id },
//     data: {
//       ...data,
//       categoryId: data.categoryId !== undefined ? Number(data.categoryId) : undefined,
//     },
//   });
//   revalidatePath("/admin/products");
//   return { data: response, message: "Product updated successfully." };
// }

export async function deleteProduct(id: number) {
  return actionWrapper(async () => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new AppError("Product not found.", 404);

    if (product.images) {
      const images = product.images as Record<string, string>;
      for (const color in images) {
        if (images[color]) await deleteImageFromCloudinary(images[color]);
      }
    }
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { data: product, message: "Product has been deleted successfully." };
  });
}
