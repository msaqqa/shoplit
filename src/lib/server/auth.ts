import { TUser } from "@/types/users";
import { comparePassword, hashPassword } from "../auth/password";
import { prisma } from "../prisma";
import { AppError } from "../error/route-error-handler";
import { baseSignupSchema, loginUserSchema } from "../schemas/auth";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}) {
  const validations = baseSignupSchema.safeParse(data);
  if (!validations.success) {
    const errorMessage = validations.error.issues[0].message;
    throw new AppError(errorMessage || "Invalid signup data.", 400);
  }
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
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  });

  // Return user
  return user;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<Omit<TUser, "password">> {
  const validations = loginUserSchema.safeParse(data);
  if (!validations.success) {
    const errorMessage = validations.error.issues[0].message;
    throw new AppError(errorMessage || "Invalid signin data.", 400);
  }
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
