import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getOrders } from "@/app/actions/orders";

async function OrdersPage() {
  const { data: result } = await getOrders({ limit: undefined });
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Orders</h1>
      </div>
      <DataTable columns={columns} data={result?.data ?? []} />
    </div>
  );
}

export default OrdersPage;
