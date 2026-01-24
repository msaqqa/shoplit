import { AppError } from "@/lib/error/route-error-handler";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// POST /api/categories/[id]
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const data = await req.json();
    const { id } = await params;
    if (!id || !data) {
      throw new AppError("Missing required fields.", 400);
    }
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data,
    });
    revalidatePath("/admin/categories");
    const response = NextResponse.json({
      message: "Category updated successfully.",
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

// DELETE /api/categories/delete/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const categoryId = Number(id);
    if (!categoryId) {
      throw new AppError("Category id is not found.", 400);
    }
    const productsCount = await prisma.product.count({
      where: { categoryId },
    });
    if (productsCount > 0) {
      throw new AppError("Cannot delete category with products.", 409);
    }
    const category = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    revalidatePath("/admin/categories");
    const response = NextResponse.json({
      message: "Category deleted successfully.",
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
