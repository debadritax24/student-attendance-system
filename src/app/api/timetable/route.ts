import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Timetable from "@/models/Timetable";
import { getSession, requireRole } from "@/lib/auth";
import { ok, error, handleError } from "@/lib/http";
import { MOCK_TIMETABLE, isMongoConnectionError } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const denied = requireRole(session, ["ADMIN", "CR", "STUDENT"]);
    if (denied) return denied;

    const { searchParams } = new URL(req.url);
    const day = searchParams.get("day");
    const section = searchParams.get("section");
    if (!section) {
      return error("section query parameter is required", 400);
    }

    try {
      await connectDB();
      const query: any = { section };
      if (day) query.day = day;
      const entries = await Timetable.find(query).sort({ day: 1, period: 1 });
      return ok(entries);
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        let entries = MOCK_TIMETABLE;
        if (day) entries = entries.filter((e) => e.day.toLowerCase() === day.toLowerCase());
        return ok(entries);
      }
      throw dbErr;
    }
  } catch (e) {
    return handleError(e);
  }
}
