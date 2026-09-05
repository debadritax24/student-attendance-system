import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Timetable from "@/models/Timetable";
import { ok, handleError } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const day = searchParams.get("day");
    const section = searchParams.get("section") || "CSE-III-E";
    const query: any = { section };
    if (day) query.day = day;
    const entries = await Timetable.find(query).sort({ day: 1, period: 1 });
    return ok(entries);
  } catch (e) {
    return handleError(e);
  }
}
