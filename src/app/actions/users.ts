"use server";
import { prisma } from "@/lib/prisma";
import { deleteImageFromCloudinary } from "./delete-image";
import { revalidatePath } from "next/cache";

// export async function createUser(data: UserFormInputs) {
//   const { name, email, password } = data;
//   if (!name || !email || !password) return;
//   await prisma.user.create({ data });
//   revalidatePath("/admin/users");
// }

export async function deleteUser(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) return;
  // delete avatar from Cloudinary
  if (user.avatar) {
    await deleteImageFromCloudinary(user.avatar);
  }
  // delete user from DB
  await prisma.user.delete({
    where: { id },
  });
  revalidatePath("/admin/users");
}
