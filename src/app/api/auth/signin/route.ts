import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth/jwt";
import { loginUser } from "@/lib/server/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await loginUser(body);

    // .catch((error) => {
    //   return NextResponse.json({ error }, { status: 401 });
    // });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // create token
    const token = await signToken({ id: user.id, role: user.role });

    // create response
    const response = NextResponse.json({
      message: "Logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ message }, { status: 401 });
  }
}
