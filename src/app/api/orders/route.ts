import { setOrderChart } from "@/lib/server/orders";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orderChart = await setOrderChart();
    const response = NextResponse.json({
      message: "Order statistics retrieved successfully.",
      data: orderChart,
    });
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
