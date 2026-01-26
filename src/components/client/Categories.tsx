"use client";
import {
  Footprints,
  Glasses,
  Briefcase,
  Shirt,
  ShoppingBasket,
  Hand,
  Venus,
  type LucideProps,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TCategories } from "@/types/categoryies";

export const categoryIcons: Record<string, React.ComponentType<LucideProps>> = {
  Footprints: Footprints,
  Glasses,
  Briefcase,
  Shirt,
  ShoppingBasket,
  Hand,
  Venus,
};

function Categories({ categories }: { categories: TCategories }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedCategory = searchParams.get("categoryId") || "";

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    const valueChecked = value == "1" ? "" : value;
    params.set("categoryId", valueChecked || "");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 bg-gray-100 p-2 rounded-lg mb-4 text-sm">
      {categories.map((category) => {
        const Icon = categoryIcons[category.icon];
        return (
          <div
            className={`flex items-center justify-center gap-2 cursor-pointer px-2 py-1 rounded-md ${
              category.slug === selectedCategory
                ? "bg-white text-gray-500 dark:bg-gray-500 dark:text-white"
                : "text-gray-500"
            }
          `}
            key={category.name}
            onClick={() => handleChange(String(category.id))}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {category.name}
          </div>
        );
      })}
    </div>
  );
}

export default Categories;
