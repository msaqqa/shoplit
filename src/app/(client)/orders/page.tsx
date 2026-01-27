import { Suspense } from "react";
import OrdersTableSkeleton from "@/components/skeletons/OrdersTableSkeleton";
import OrdersList from "@/components/client/OrdersList";

export const metadata = {
  title: "Orders",
  robots: {
    index: false,
    follow: false,
  },
};

async function OrdersPage() {
  return (
    <div className="w-full">
      <h1 className="text-2xl my-4 font-medium">Your Orders</h1>
      <Suspense fallback={<OrdersTableSkeleton />}>
        <OrdersList />
      </Suspense>
    </div>
  );
}

export default OrdersPage;
