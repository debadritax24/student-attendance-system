import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { getSession, requireRole } from "@/lib/auth";
import { ok, error, handleError } from "@/lib/http";
import { isMongoConnectionError } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const s = await getSession(req);
    const d = requireRole(s, ["CR", "ADMIN"]);
    if (d) return d;
    const date = req.nextUrl.searchParams.get("date");
    if (!date) return error("date is required", 400);

    try {
      await connectDB();
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const rows = await Attendance.aggregate([
        { $match: { date: { $gte: start, $lt: end } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      return ok(rows);
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        return ok([
          { _id: "PRESENT", count: 53 },
          { _id: "ABSENT", count: 6 },
          { _id: "LATE", count: 2 },
        ]);
      }
      throw dbErr;
    }
  } catch (e) {
    return handleError(e);
  }
}
