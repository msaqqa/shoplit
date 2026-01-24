import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { AppError } from "@/lib/error/route-error-handler";
import { revalidatePath } from "next/cache";

// GET /api/categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    const response = NextResponse.json({
      message: "Categories fetched successfully.",
      data: categories,
    });
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, icon } = body;
    if (!name || !slug || !icon) {
      throw new AppError("Missing required fields.", 400);
    }
    const category = await prisma.category.create({ data: body });
    revalidatePath("/admin/categories");
    const response = NextResponse.json({
      message: "Category added successfully.",
      data: category,
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
