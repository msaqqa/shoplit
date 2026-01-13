import { getOrderChart } from "@/lib/server/orders";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getOrderChart();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ message }, { status: 401 });
  }
}
