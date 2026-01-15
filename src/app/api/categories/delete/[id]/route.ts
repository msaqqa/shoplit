import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const categoryId = Number(id);
    if (!categoryId) {
      return NextResponse.json(
        { message: "category id is not found" },
        { status: 400 }
      );
    }
    const productsCount = await prisma.product.count({
      where: { categoryId },
    });
    if (productsCount > 0) {
      throw new Error("Cannot delete category with products");
    }
    const category = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    revalidatePath("/admin/categories");
    const response = NextResponse.json({
      message: "Category deleted successfully",
      data: category,
    });
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
