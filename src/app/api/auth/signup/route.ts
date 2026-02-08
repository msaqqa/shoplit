import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { registerUser } from "@/lib/server/auth";
import { AppError } from "@/lib/error/app-error";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await registerUser(body);
    revalidatePath("/admin/users");
    const response = NextResponse.json({
      message: "Account created successfully.",
      data: user,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
