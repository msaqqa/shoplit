import AppAreaChart from "@/components/admin/AppAreaChart";
import AppBarChart from "@/components/admin/AppBarChart";
import AppPieChart from "@/components/admin/AppPieChart";
import CardList from "@/components/admin/CardList";
import TodoList from "@/components/admin/TodoList";
import { fetchOrderChart } from "@/services/orders";
import { TOrderChart } from "@/types/orders";

async function AdminHomePage() {
  const orderChart = await fetchOrderChart();
  return (
    <div className="grid lg:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2">
        <AppBarChart orderChart={orderChart as TOrderChart[]} />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Latest Transactions" />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <AppPieChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <TodoList />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2">
        <AppAreaChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="popularProducts" />
      </div>
    </div>
  );
}

export default AdminHomePage;
