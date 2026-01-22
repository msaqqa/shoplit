import { getOrderChart } from "@/lib/server/orders";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getOrderChart();
    return NextResponse.json({
      message: "Order statistics retrieved successfully.",
      data: result,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
