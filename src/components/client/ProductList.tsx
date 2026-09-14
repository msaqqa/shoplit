import { TProduct, TProducts, TProductsParams } from "@/types/products";
import Categories from "./Categories";
import Link from "next/link";
import Filter from "./Filter";
import ProductCard from "./ProductCard";
import { getProducts } from "@/app/actions/products";
import { TCategories } from "@/types/categoryies";
import { prisma } from "@/lib/prisma";

async function ProductList({
  categoryId,
  sort,
  search,
  params,
}: TProductsParams) {
  const { data: productsRes } = await getProducts({
    categoryId,
    sort,
    search,
    params,
  });
  const categories = (await prisma.category.findMany({
    orderBy: { id: "asc" },
  })) as TCategories;
  const products = (productsRes as { data: TProducts }).data ?? [];
  const renderProducts = () => {
    if (!products || products.length === 0) {
      return (
        <div className="w-full text-center py-20 text-gray-500">
          No products found.
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as TProduct} />
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <Categories categories={categories} />
      {params === "products" && <Filter />}
      {renderProducts()}
      {params === "homePage" && (
        <Link
          href={
            categoryId ? `/products/?categoryId=${categoryId}` : "/products"
          }
          className="flex justify-end mt-4 underline text-sm text-gray-500"
        >
          See All Products
        </Link>
      )}
    </div>
  );
}

export default ProductList;
