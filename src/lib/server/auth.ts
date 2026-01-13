import { TUser } from "@/types/users";
import { comparePassword, hashPassword } from "../auth/password";
import { prisma } from "../prisma";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}) {
  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      avatar: data.avatar,
    },
  });

  return user;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<Omit<TUser, "password">> {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("User not found");

  const valid = await comparePassword(data.password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  // Return user without password
  const { password: _, ...safeUser } = user;
  return safeUser;
}
