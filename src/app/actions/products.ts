"use server";

import { prisma } from "@/lib/prisma";
import { TProductsParams } from "@/types/products";
import { revalidatePath } from "next/cache";
import { deleteImageFromCloudinary } from "./cloudinary";
import { actionWrapper } from "@/lib/action-wrapper";
import { AppError } from "@/lib/error/app-error";
import { ProductFormInputs, productFormSchema } from "@/lib/schemas/products";
import { validateAdmin } from "@/lib/auth/guards";

// Create product
export async function createProduct(data: ProductFormInputs) {
  return actionWrapper(async () => {
    await validateAdmin();
    const validations = productFormSchema.safeParse(data);
    if (!validations.success) {
      const errorMessage = validations.error.issues[0].message;
      throw new AppError(errorMessage || "Invalid product data.", 400);
    }
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

// Get products
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

// Get single product
export async function geTProductByID(id: number) {
  return actionWrapper(async () => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new AppError("Product not found.", 404);
    return { data: product };
  });
}

// Update product
export async function updateProduct(id: number, data: ProductFormInputs) {
  return actionWrapper(async () => {
    await validateAdmin();
    const response = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        categoryId: Number(data.categoryId),
      },
    });
    revalidatePath("/admin/products");
    return { data: response, message: "Product updated successfully." };
  });
}

// Delete product
export async function deleteProduct(id: number) {
  return actionWrapper(async () => {
    await validateAdmin();
    if (!id) {
      throw new AppError("Product id is required.", 400);
    }
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) throw new AppError("Product not found.", 404);

    if (product.images) {
      const images = product.images as Record<string, string>;
      for (const color in images) {
        if (images[color]) await deleteImageFromCloudinary(images[color]);
      }
    }

    const response = await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return {
      data: response,
      message: "Product has been deleted successfully.",
    };
  });
}
