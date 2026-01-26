import ProductList from "@/components/client/ProductList";
import { TProductsParams } from "@/types/products";

async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<TProductsParams>;
}) {
  const categoryId = (await searchParams).categoryId;
  const sort = (await searchParams).sort;
  const search = (await searchParams).search;

  return (
    <div>
      <ProductList
        categoryId={categoryId}
        sort={sort}
        search={search}
        params="products"
      />
    </div>
  );
}

export default ProductsPage;
