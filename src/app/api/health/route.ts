import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const start = Date.now();
  try {
    const conn = await connectDB();
    const ms = Date.now() - start;
    return NextResponse.json({
      success: true,
      service: "Attendify API",
      status: "ok",
      database: {
        connected: true,
        name: conn.connection?.db?.databaseName || "attendify",
        host: conn.connection?.host || "unknown",
        responseTime: `${ms}ms`,
      },
    });
  } catch (error: any) {
    const ms = Date.now() - start;
    return NextResponse.json(
      {
        success: false,
        service: "Attendify API",
        status: "error",
        database: {
          connected: false,
          error: error.message || "Failed to connect to database",
          responseTime: `${ms}ms`,
        },
      },
      { status: 503 }
    );
  }
}
