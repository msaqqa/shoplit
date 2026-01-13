import { prisma } from "../prisma";
import { startOfMonth, subMonths } from "date-fns";

export async function getOrderChart() {
  const now = new Date();
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
        lte: now,
      },
    },
    select: {
      createdAt: true,
      status: true,
    },
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const results: { month: string; total: number; successful: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    const monthOrders = orders.filter(
      (o) =>
        o.createdAt.getFullYear() === year &&
        o.createdAt.getMonth() + 1 === month
    );

    results.push({
      month: monthNames[month - 1],
      total: monthOrders.length,
      successful: monthOrders.filter((o) => o.status === "success").length,
    });
  }

  return results;
}
