import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth/jwt";
import { loginUser } from "@/lib/server/auth";
import { RouteError } from "@/lib/error/route-error-handler";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await loginUser(body);

    if (!user) throw new RouteError("Invalid credentials", 404);

    // if (!user) {
    //   return NextResponse.json(
    //     { message: "Invalid credentials" },
    //     { status: 401 }
    //   );
    // }

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
  } catch {
    const message = "An unexpected error occurred.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
