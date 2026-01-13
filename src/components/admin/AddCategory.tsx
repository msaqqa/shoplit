"use client";

// import { createCategory } from "@/app/actions/categories";
import { CategoryFormInputs, categoryFormSchema } from "@/types/categoryies";
import { zodResolver } from "@hookform/resolvers/zod";
import { Projector } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { createCategory } from "@/services/categories";
import { useRouter } from "next/navigation";

function AddCategory({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormInputs>({
    resolver: zodResolver(categoryFormSchema),
  });

  const handleCategoryForm: SubmitHandler<CategoryFormInputs> = async (
    data
  ) => {
    await createCategory(data);
    toast.success("Category added successfully");
    router.refresh();
    onSuccess();
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Add Category</SheetTitle>
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
        >
          Add
          <Projector className="w-3 h-3" />
        </button>
      </form>
    </SheetContent>
  );
}

export default AddCategory;
