import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { AppError } from "@/lib/error/route-error-handler";
import { revalidatePath } from "next/cache";
import { Category } from "@prisma/client";
import { categoryFormSchema } from "@/lib/schemas/categories";
import { validateAdmin } from "@/lib/auth/guards";

// GET GATEGORIES
export async function GET() {
  try {
    const categories: Category[] = await prisma.category.findMany({
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

// POST GATEGORY
export async function POST(req: Request) {
  try {
    await validateAdmin();
    const body = await req.json();
    const validations = categoryFormSchema.safeParse(body);
    if (!validations.success) {
      const errorMessage = validations.error.issues[0].message;
      throw new AppError(errorMessage || "Invalid category data.", 400);
    }
    const newCategory: Category = await prisma.category.create({ data: body });
    revalidatePath("/admin/categories");
    const response = NextResponse.json({
      message: "Category added successfully.",
      data: newCategory,
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
