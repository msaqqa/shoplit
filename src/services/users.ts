import { prisma } from "@/lib/prisma";
import { api } from "./api";
import { TUser } from "@/types/users";

export async function getUsers() {
  try {
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
  } catch (error) {
    throw error;
  }
}

export async function getUserById(id: number) {
  try {
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
  } catch (error) {
    throw error;
  }
}

// export async function updateUserById(id: number, data: any) {
//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data,
//     });
//     return updatedUser;
//   } catch (error) {
//     throw error;
//   }
// }

export async function updateUserById(id: number, data: TUser) {
  try {
    const res = await api.post("/users", { id, data });
    return res.data;
  } catch (error) {
    throw error;
  }
}
