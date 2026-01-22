import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { registerUser } from "@/lib/server/auth";
import { RouteError } from "@/lib/error/route-error-handler";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await registerUser(body);
    revalidatePath("/admin/users");
    return NextResponse.json({
      message: "Account created successfully.",
      data: user,
    });
  } catch (error: unknown) {
    if (error instanceof RouteError) {
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
