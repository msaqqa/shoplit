import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getOrders } from "@/services/orders";
import { geTProducts } from "@/services/products";
import { getUsers } from "@/services/users";

async function OrdersPage() {
  const data = await getOrders({ limit: undefined });
  const products = await geTProducts({});
  const users = await getUsers();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Orders</h1>
      </div>
      <DataTable
        columns={columns}
        data={data}
        products={products}
        users={users}
      />
    </div>
  );
}

export default OrdersPage;
