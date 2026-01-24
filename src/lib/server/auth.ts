import { TUser } from "@/types/users";
import { comparePassword, hashPassword } from "../auth/password";
import { prisma } from "../prisma";
import { AppError } from "../error/route-error-handler";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}) {
  // Check if email already exists
  const checkEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (checkEmail) throw new AppError("This email is already registered.", 400);

  // Hash password and create user
  const hashed = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      avatar: data.avatar,
    },
  });

  // Return user without password
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<Omit<TUser, "password">> {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) throw new AppError("User not found.", 404);

  // Verify password
  const valid = await comparePassword(data.password, user.password);
  if (!valid) throw new AppError("Invalid credentials.", 401);

  // Return user without password
  const { password: _, ...safeUser } = user;
  return safeUser;
}
