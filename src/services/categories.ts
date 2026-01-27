import { api } from "./api";
import { CategoryFormInputs } from "@/lib/schemas/categories";

export async function getCategories<T>() {
  const response = await api.get("/categories");
  return response.data as T;
}

export async function createCategory(data: CategoryFormInputs) {
  const response = await api.post("/categories", data);
  return response.data;
}

export async function updateCategory(
  categoryId: number,
  data: CategoryFormInputs,
) {
  const response = await api.post(`/categories/${categoryId}`, data);
  return response.data;
}

export async function deleteCategory(categoryId: number) {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
}
