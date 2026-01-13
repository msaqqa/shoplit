import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { registerUser } from "@/lib/server/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await registerUser(body);
    revalidatePath("/admin/users");
    return NextResponse.json(user);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ message }, { status: 400 });
  }
}
