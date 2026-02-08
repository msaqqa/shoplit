import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth/jwt";
import { loginUser } from "@/lib/server/auth";
import { AppError } from "@/lib/error/app-error";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await loginUser(body);

    // create token
    const token = await signToken({ id: user.id, role: user.role });

    // create response
    const response = NextResponse.json({
      message: "Logged in successfully.",
      data: user,
    });

    // set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
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
