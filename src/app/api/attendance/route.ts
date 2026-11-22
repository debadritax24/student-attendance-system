import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { getSession, requireRole } from "@/lib/auth";
import { attendanceCreate } from "@/validation";
import { ok, error, handleError } from "@/lib/http";
import { pagination } from "@/lib/query";
import { MOCK_ATTENDANCE_RECORDS, isMongoConnectionError } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const s = await getSession(req);
    const d = requireRole(s, ["CR", "STUDENT", "ADMIN"]);
    if (d) return d;

    const sp = req.nextUrl.searchParams;
    const p = pagination(sp);
    const f: any = {};
    for (const k of ["student", "subject", "status"]) {
      if (sp.get(k)) f[k] = sp.get(k);
    }
    if (sp.get("from") || sp.get("to")) f.date = {};
    if (sp.get("from")) f.date.$gte = new Date(sp.get("from")!);
    if (sp.get("to")) f.date.$lte = new Date(sp.get("to")!);

    try {
      await connectDB();
      if (s!.role === "STUDENT") {
        const User = (await import("@/models/User")).default;
        const u = await User.findById(s!.userId);
        if (!u) return error("User not found", 404);
        f.student = u.studentId;
      }
      const [items, total] = await Promise.all([
        Attendance.find(f)
          .populate("student subject markedBy", "name rollNumber code email")
          .sort({ date: -1 })
          .skip(p.skip)
          .limit(p.limit),
        Attendance.countDocuments(f),
      ]);
      return ok({ items, total, page: p.page, limit: p.limit });
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        const items = MOCK_ATTENDANCE_RECORDS.slice(p.skip, p.skip + p.limit);
        return ok({ items, total: MOCK_ATTENDANCE_RECORDS.length, page: p.page, limit: p.limit });
      }
      throw dbErr;
    }
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const s = await getSession(req);
    const d = requireRole(s, ["CR", "ADMIN"]);
    if (d) return d;
    const body = attendanceCreate.parse(await req.json());
    try {
      await connectDB();
      const attendance = await Attendance.create({ ...body, markedBy: s!.userId });
      return ok(attendance, 201);
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        const mockItem = {
          _id: `mock-att-${Date.now()}`,
          ...body,
          markedBy: s!.userId,
        };
        MOCK_ATTENDANCE_RECORDS.unshift(mockItem);
        return ok(mockItem, 201);
      }
      throw dbErr;
    }
  } catch (e) {
    return handleError(e);
  }
}
