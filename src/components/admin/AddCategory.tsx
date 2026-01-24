"use client";
import {
  CategoryFormInputs,
  categoryFormSchema,
  TCategory,
} from "@/types/categoryies";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Projector } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { createCategory, updateCategory } from "@/services/categories";
import { useRouter } from "next/navigation";
import { SidebarMenuButton } from "../ui/sidebar";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

function AddCategory({
  category,
  tableBtn,
}: {
  category?: TCategory;
  tableBtn?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormInputs>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name,
      slug: category?.slug,
      icon: category?.icon,
    },
  });

  const handleCategoryForm: SubmitHandler<CategoryFormInputs> = async (
    data,
  ) => {
    setIsProcessing(true);
    await (category ? updateCategory(category.id, data) : createCategory(data));
    toast.success("Category added successfully");
    setOpen(false);
    router.refresh();
    setIsProcessing(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SidebarMenuButton
          className={`cursor-pointer ${tableBtn && "w-auto flex items-center gap-2 bg-blue-500 text-white px-2 py-1 text-sm rounded-md cursor-pointer"}`}
        >
          {category ? (
            <>
              <Edit />
              <span>Edit Category</span>
            </>
          ) : (
            <>
              <Plus />
              <span>Add Category</span>
            </>
          )}
        </SidebarMenuButton>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="mb-4">
            {category ? "Update" : "Add"} Category
          </SheetTitle>
        </SheetHeader>
        <form
          className="px-4 flex flex-col gap-4"
          onSubmit={handleSubmit(handleCategoryForm)}
        >
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-xs font-medium text-gray-500">
              Name
            </label>
            <input
              className="border-b border-gray-200 py-2 outline-none test-sm"
              id="name"
              placeholder="Dresses"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>
          {/* Slug */}
          <div className="flex flex-col gap-1">
            <label htmlFor="slug" className="text-xs font-medium text-gray-500">
              Slug
            </label>
            <input
              className="border-b border-gray-200 py-2 outline-none test-sm"
              id="slug"
              placeholder="dresses"
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-red-500 text-xs">{errors.slug.message}</p>
            )}
          </div>
          {/* Icon */}
          <div className="flex flex-col gap-1">
            <label htmlFor="icon" className="text-xs font-medium text-gray-500">
              Icon
            </label>
            <input
              className="border-b border-gray-200 py-2 outline-none test-sm"
              id="icon"
              placeholder="Briefcase"
              {...register("icon")}
            />
            {errors.icon && (
              <p className="text-red-500 text-xs">{errors.icon.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
            disabled={isProcessing}
          >
            {isProcessing ? <Spinner className="size-4 animate-spin" /> : null}
            {category ? "Update" : "Add"} category
            <Projector className="w-3 h-3" />
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default AddCategory;
