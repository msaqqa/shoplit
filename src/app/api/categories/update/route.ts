import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, data } = body;
    if (!id) {
      return NextResponse.json(
        { message: "category id is not found" },
        { status: 400 },
      );
    }
    const cat = await prisma.category.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/categories");
    const response = NextResponse.json({
      message: "Category updated successfully",
      data: cat,
    });
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
