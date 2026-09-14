import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Prevent caching so the DB is actually hit on every run.
export const dynamic = "force-dynamic";

// Keeps the Supabase Postgres instance from being paused/slept on the
// free tier (which pauses after ~7 days of inactivity). Vercel Cron calls
// this twice a week; we run a lightweight query to register activity.
export async function GET(req: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically
  // when the CRON_SECRET env var is set. Reject anything else.
  const authHeader = req.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      message: "Database is alive.",
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const databaseError = error as {
      code?: unknown;
      meta?: unknown;
    };
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    console.error("Keep-alive cron database check failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      message,
      code: databaseError.code,
      meta: databaseError.meta,
    });

    return NextResponse.json(
      { message: "Database keep-alive failed. Check the deployment logs." },
      { status: 500 },
    );
  }
}
