import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, data } = await req.json();
    const updatedUser = await prisma.user.update({ where: { id }, data });
    revalidatePath("/admin/users");
    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
