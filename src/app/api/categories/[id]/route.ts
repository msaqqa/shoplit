import { validateAdmin } from "@/lib/auth/guards";
import { AppError } from "@/lib/error/route-error-handler";
import { prisma } from "@/lib/prisma";
import { updateSchema } from "@/lib/schemas/categories";
import { Category } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// UPDATE GATEGORY
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await validateAdmin();
    const data = await req.json();
    const { id } = await params;
    const validations = updateSchema.safeParse({ ...data, id: Number(id) });
    if (!validations.success) {
      const errorMessage = validations.error.issues[0].message;
      throw new AppError(errorMessage || "Invalid category data.", 400);
    }
    const updatedCategory: Category = await prisma.category.update({
      where: { id: Number(id) },
      data,
    });
    revalidatePath("/admin/categories");
    const response = NextResponse.json({
      message: "Category updated successfully.",
      data: updatedCategory,
    });
    return response;
  } catch (error: unknown) {
    // Handle custom application errors (e.g., validation or logic errors)
    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    // Handle specific prisma errors when the error code is 'P2025' meaning the element not found
    if ((error as { code: string }).code === "P2025") {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 },
      );
    }
    // Handle any other unexpected server errors
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// DELETE GATEGORY
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await validateAdmin();
    const { id } = await params;
    const categoryId = Number(id);
    if (!categoryId) {
      throw new AppError("Category id is required.", 400);
    }
    const productsCount = await prisma.product.count({
      where: { categoryId },
    });
    if (productsCount > 0) {
      throw new AppError("Cannot delete category with products.", 409);
    }
    const deletedCategory: Category = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    revalidatePath("/admin/categories");
    const response = NextResponse.json({
      message: "Category deleted successfully.",
      data: deletedCategory,
    });
    return response;
  } catch (error: unknown) {
    // Handle custom application errors (e.g., validation or logic errors)
    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    // Handle specific prisma errors when the error code is 'P2025' meaning the element not found
    if ((error as { code: string }).code === "P2025") {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 },
      );
    }
    // Handle any other unexpected server errors
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
