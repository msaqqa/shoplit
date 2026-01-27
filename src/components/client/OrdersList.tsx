import { getOrders } from "@/app/actions/orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TOrder } from "@/types/orders";

async function OrdersList() {
  const { data: result } = await getOrders();
  const orders = result?.data || [];
  if (!orders || orders?.length === 0) {
    return (
      <div className="w-full text-center py-20 text-gray-500">
        No orders found!
      </div>
    );
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="w-[10%] font-medium text-gray-500">
              Order ID
            </TableHead>
            <TableHead className="w-[10%] font-medium text-gray-500">
              Total
            </TableHead>
            <TableHead className="w-[10%] font-medium text-gray-500">
              Status
            </TableHead>
            <TableHead className="w-[20%] font-medium text-gray-500">
              Date
            </TableHead>
            <TableHead className="font-medium text-gray-500">
              Products
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {(orders ?? []).map((order: TOrder) => (
            <TableRow key={order.id}>
              {/* Order ID */}
              <TableCell>{order.id}</TableCell>
              {/* Total */}
              <TableCell>${order.amount.toFixed(2)}</TableCell>
              {/* Status */}
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status}
                </span>
              </TableCell>

              {/* Date */}
              <TableCell>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US")
                  : "-"}
              </TableCell>

              {/* Products Names */}
              <TableCell
                className="max-w-[300px] truncate"
                title={order.products?.map((p) => p.name).join(", ")}
              >
                {order.products?.map((product) => product.name).join(", ") ||
                  "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default OrdersList;
