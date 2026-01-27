import ProductList from "@/components/client/ProductList";
import ProductListSkeleton from "@/components/skeletons/ProductListSkeleton";
import { TProductsParams } from "@/types/products";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}): Promise<Metadata> {
  const categoryId = (await searchParams).categoryId;
  const title = categoryId ? `Explore Our Collections` : "Shop All Products";
  return {
    title: title,
    description:
      "Browse our latest collection of premium products. Fast shipping and best quality guaranteed.",
  };
}

async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<TProductsParams>;
}) {
  const categoryId = (await searchParams).categoryId;
  const sort = (await searchParams).sort;
  const search = (await searchParams).search;

  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList
        categoryId={categoryId}
        sort={sort}
        search={search}
        params="products"
      />
    </Suspense>
  );
}

export default ProductsPage;
