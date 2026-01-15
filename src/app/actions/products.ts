"use server";

import { prisma } from "@/lib/prisma";
import { ProductFormInputs, TProductFormEdit } from "@/types/products";
import { revalidatePath } from "next/cache";
import { deleteImageFromCloudinary } from "./delete-image";

export async function createProduct(data: ProductFormInputs) {
  await prisma.product.create({
    data: {
      ...data,
      categoryId: Number(data.categoryId),
    },
  });

  revalidatePath("/admin/products");
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
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return;

  // delete images from Cloudinary
  if (product.images) {
    const images = product.images as Record<string, string>;
    for (const color in images) {
      const url = images[color];
      if (url) {
        await deleteImageFromCloudinary(url);
      }
    }
  }

  // delete product from DB
  await prisma.product.delete({
    where: { id },
  });
  revalidatePath("/admin/products");
}
