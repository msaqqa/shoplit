import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getProducts } from "@/app/actions/products";

async function ProductsPage() {
  const { data } = await getProducts();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Products</h1>
      </div>
      <DataTable columns={columns as never} data={data ?? []} />
    </div>
  );
}

export default ProductsPage;
