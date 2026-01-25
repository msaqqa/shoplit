import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getCategories } from "@/services/categories";
import { TCategories } from "@/types/categoryies";

async function CategoriesPage() {
  const result = await getCategories();
  const categories: TCategories = (result as { data: TCategories }).data || [];

  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Categories</h1>
      </div>
      <DataTable columns={columns as never} data={categories} />
    </div>
  );
}

export default CategoriesPage;
