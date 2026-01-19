import { prisma } from "@/lib/prisma";
import { api } from "./api";
import { TUser } from "@/types/users";

export async function getUsers() {
  const response = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      status: true,
    },
  });
  return response;
}

export async function getUserById(id: number) {
  const response = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
    },
  });
  return response;
}

export async function updateUserById(id: number, data: TUser) {
  const response = await api.post("/users", { id, data });
  return response.data;
}
