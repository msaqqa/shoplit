"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TOrderChart } from "@/types/orders";

// const chartData = [
//   { month: "January", total: 186, successful: 80 },
//   { month: "February", total: 305, successful: 200 },
//   { month: "March", total: 237, successful: 120 },
//   { month: "April", total: 173, successful: 100 },
//   { month: "May", total: 209, successful: 130 },
//   { month: "June", total: 214, successful: 140 },
// ];

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--color-chart-1)",
  },
  successful: {
    label: "Successful",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

export function AppBarChart({ orderChart }: { orderChart: TOrderChart[] }) {
  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Total Revenue</h1>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={orderChart}>
          {/*  CartesianGrid to add vertical grid lines, and can u remove any one as in the bottom*/}
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          <Bar dataKey="successful" fill="var(--color-successful)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default AppBarChart;
