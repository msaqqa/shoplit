import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, icon } = body;
    if (!name || !slug || !icon) {
      return NextResponse.json(
        { message: "some data is not found" },
        { status: 400 }
      );
    }
    const cat = await prisma.category.create({ data: body });
    revalidatePath("/admin/categories");
    const response = NextResponse.json({
      message: "Category added successfully",
      data: cat,
    });
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
