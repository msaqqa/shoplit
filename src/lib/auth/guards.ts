import { cookies } from "next/headers";
import { AppError } from "../error/route-error-handler";
import { verifyToken } from "./jwt";

// Validate user
export async function validateUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new AppError("Authentication required.", 401);
  }
  const decoded = await verifyToken(token);
  return decoded;
}

// Validate admin
export async function validateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new AppError("Authentication required.", 401);
  }
  const decoded = await verifyToken(token);
  if (!decoded || decoded.role !== "ADMIN") {
    throw new AppError("Access denied. Admin privileges required.", 403);
  }
  return decoded;
}
