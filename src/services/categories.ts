import { api } from "./api";
import { CategoryFormInputs } from "@/types/categoryies";

export async function getCategories() {
  const response = await api.get("/categories/get");
  return response.data;
}

export async function createCategory(data: CategoryFormInputs) {
  const response = await api.post("/categories/create", data);
  return response.data;
}

export async function updateCategory(id: number, data: CategoryFormInputs) {
  const response = await api.post("/categories/update", { id, data });
  return response.data;
}

export async function deleteCategory(categoryId: number) {
  const response = await api.delete(`/categories/delete/${categoryId}`);
  return response.data;
}
