import { prisma } from "@/lib/prisma";
import { api } from "./api";
import { CategoryFormInputs } from "@/types/categoryies";

export async function getCategories() {
  try {
    const response = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function createCategory(data: CategoryFormInputs) {
  try {
    const res = await api.post("/categories/create", data);
    return res.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

export async function updateCategory(id: number, data: CategoryFormInputs) {
  try {
    const res = await api.post("/categories/update", { id, data });
    return res.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

export async function deleteCategory(categoryId: number) {
  const res = await api.delete(`/categories/delete/${categoryId}`);
  return res.data;
}
