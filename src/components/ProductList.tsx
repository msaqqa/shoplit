import { TProduct, TProductsParams } from "@/types/products";
import Categories from "./Categories";
import Link from "next/link";
import Filter from "./Filter";
import ProductCard from "./ProductCard";
import { getProducts } from "@/app/actions/products";
import { getCategories } from "@/services/categories";
import { TCategories } from "@/types/categoryies";

async function ProductList({
  categoryId,
  sort,
  search,
  params,
}: TProductsParams) {
  const { data: productsData } = await getProducts({
    categoryId,
    sort,
    search,
    params,
  });
  const result = await getCategories();
  const categories = (result as { data: TCategories }).data;
  return (
    <div className="w-full">
      <Categories categories={categories} />
      {params === "products" && <Filter />}
      {
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {(productsData?.data ?? []).map((product) => (
            <ProductCard key={product.id} product={product as TProduct} />
          ))}
        </div>
      }
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
