import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";

async function ProductsPage() {
  const data = await getProducts();
  const categories = await getCategories();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Products</h1>
      </div>
      <DataTable columns={columns as any} data={data} categories={categories} />
    </div>
  );
}

export default ProductsPage;
