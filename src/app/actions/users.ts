"use server";
import { prisma } from "@/lib/prisma";
import { deleteImageFromCloudinary } from "./delete-image";
import { revalidatePath } from "next/cache";
import { actionWrapper } from "@/lib/action-wrapper";
import { UserUpdateInputs } from "@/types/users";

// export async function createUser(data: UserUpdateInputs) {
//   const { name, email, password } = data;
//   if (!name || !email || !password) return;
//   await prisma.user.create({ data });
//   revalidatePath("/admin/users");
// }

export async function getUsers() {
  return actionWrapper(async () => {
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
  });
}

export async function getUserById(id: number) {
  return actionWrapper(async () => {
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
  });
}

export async function updateUserById(id: number, data: UserUpdateInputs) {
  return actionWrapper(async () => {
    const response = await prisma.user.update({ where: { id }, data });
    revalidatePath("/admin/users");
    return response;
  });
}

export async function deleteUser(id: number) {
  return actionWrapper(async () => {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return;
    // delete avatar from cloudinary
    if (user.avatar) {
      await deleteImageFromCloudinary(user.avatar);
    }
    // delete user from DB
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/admin/users");
    return user;
  });
}
