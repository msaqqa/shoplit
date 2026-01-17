import { prisma } from "@/lib/prisma";
import { TProductsParams } from "@/types/products";

export async function getProducts({
  categoryId,
  sort,
  search,
  params,
}: TProductsParams = {}) {
  try {
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
  } catch (error) {
    throw error;
  }
}

export async function getProductsByCategory(slug: string) {
  try {
    const response = await prisma.product.findMany({
      where: {
        category: { slug },
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function geTProductByID(id: number) {
  try {
    const response = await prisma.product.findUnique({
      where: { id },
    });
    return response;
  } catch (error) {
    throw error;
  }
}
