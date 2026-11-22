import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { getSession, requireRole } from "@/lib/auth";
import { ok, handleError } from "@/lib/http";
import { MOCK_SUBJECTS, isMongoConnectionError } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const s = await getSession(req);
    const d = requireRole(s, ["CR", "STUDENT", "ADMIN"]);
    if (d) return d;

    try {
      await connectDB();
      const rows = await Attendance.aggregate([
        {
          $group: {
            _id: "$subject",
            total: { $sum: 1 },
            present: {
              $sum: { $cond: [{ $in: ["$status", ["PRESENT", "LATE"]] }, 1, 0] },
            },
            absent: { $sum: { $cond: [{ $eq: ["$status", "ABSENT"] }, 1, 0] } },
          },
        },
        { $lookup: { from: "subjects", localField: "_id", foreignField: "_id", as: "subject" } },
        { $unwind: "$subject" },
        {
          $project: {
            _id: 0,
            subject: "$subject.name",
            code: "$subject.code",
            total: 1,
            present: 1,
            absent: 1,
            percentage: {
              $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 2],
            },
          },
        },
      ]);
      return ok(rows);
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        const mockRows = MOCK_SUBJECTS.map((sub, i) => {
          const total = 28 + (i % 5);
          const present = Math.round(total * (0.84 + (i % 3) * 0.04));
          return {
            subject: sub.name,
            code: sub.code,
            total,
            present,
            absent: total - present,
            percentage: Math.round((present / total) * 100),
          };
        });
        return ok(mockRows);
      }
      throw dbErr;
    }
  } catch (e) {
    return handleError(e);
  }
}
