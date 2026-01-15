import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getCategories } from "@/services/categories";

async function CategoriesPage() {
  const data = await getCategories();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Categories</h1>
      </div>
      <DataTable columns={columns as any} data={data} />
    </div>
  );
}

export default CategoriesPage;
