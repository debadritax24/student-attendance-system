import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { getSession, requireRole } from "@/lib/auth";
import { bulkAttendance } from "@/validation";
import { ok, handleError } from "@/lib/http";
import { MOCK_ATTENDANCE_RECORDS, isMongoConnectionError } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const s = await getSession(req);
    const d = requireRole(s, ["CR", "ADMIN"]);
    if (d) return d;

    const b = bulkAttendance.parse(await req.json());

    try {
      await connectDB();
      const ops = b.records.map((r) => ({
        updateOne: {
          filter: { student: r.student, subject: b.subject, date: b.date },
          update: {
            $set: { ...r, subject: b.subject, date: b.date, markedBy: s!.userId },
          },
          upsert: true,
        },
      }));
      const result = await Attendance.bulkWrite(ops);
      return ok(
        {
          matched: result.matchedCount,
          modified: result.modifiedCount,
          upserted: result.upsertedCount,
        },
        201
      );
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        b.records.forEach((r) => {
          MOCK_ATTENDANCE_RECORDS.push({
            student: r.student,
            subject: b.subject,
            date: b.date,
            status: r.status,
            markedBy: s!.userId,
          });
        });
        return ok(
          {
            matched: b.records.length,
            modified: b.records.length,
            upserted: 0,
          },
          201
        );
      }
      throw dbErr;
    }
  } catch (e) {
    return handleError(e);
  }
}
