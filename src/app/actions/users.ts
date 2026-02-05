"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { actionWrapper } from "@/lib/action-wrapper";
import { updateUserServerSchema, UserUpdateInputs } from "@/lib/schemas/users";
import { deleteImageFromCloudinary } from "./cloudinary";
import { AppError } from "@/lib/error/route-error-handler";
import { validateAdmin, validateUser } from "@/lib/auth/guards";

// import { baseSignupSchema } from "@/lib/schemas/auth";
// export async function createUser(data: any) {
//   const validations = baseSignupSchema.safeParse(data);
//   if (!validations.success) {
//     const errorMessage = validations.error.issues[0].message;
//     throw new AppError(errorMessage || "Invalid user data.", 400);
//   }
//   const response = await prisma.user.create({ data });
//   revalidatePath("/admin/users");
//   return { data: response, message: "User has been created successfully." };
// }

export async function getUsers() {
  return actionWrapper(async () => {
    await validateAdmin();
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
    return { data: response };
  });
}

export async function getUserById(id: number) {
  return actionWrapper(async () => {
    await validateAdmin();
    const response = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        status: true,
        createdAt: true,
      },
    });
    if (!response) {
      throw new AppError("User not found.", 404);
    }
    return { data: response };
  });
}

export async function updateUserById(id: number, data: UserUpdateInputs) {
  return actionWrapper(async () => {
    await validateUser();
    const validations = updateUserServerSchema.safeParse(data);
    if (!validations.success) {
      const errorMessage = validations.error.issues[0].message;
      throw new AppError(errorMessage || "Invalid user data.", 400);
    }
    const response = await prisma.user.update({ where: { id }, data });
    revalidatePath("/admin/users");
    return {
      data: response,
      message: "User settings have been updated successfully.",
    };
  });
}

export async function deleteUser(id: number) {
  return actionWrapper(async () => {
    await validateAdmin();
    if (!id) {
      throw new AppError("User id is required.", 400);
    }
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) throw new AppError("User not found.", 404);

    // delete avatar from cloudinary
    if (user.avatar) {
      await deleteImageFromCloudinary(user.avatar);
    }

    // delete user from DB
    const response = await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/admin/users");
    return { data: response, message: "User has been deleted successfully." };
  });
}
