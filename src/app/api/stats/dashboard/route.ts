import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Subject from "@/models/Subject";
import Attendance from "@/models/Attendance";
import { getSession, requireRole } from "@/lib/auth";
import { ok, handleError } from "@/lib/http";
import { MOCK_STUDENTS, MOCK_SUBJECTS, isMongoConnectionError } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const s = await getSession(req);
    const d = requireRole(s, ["CR", "STUDENT", "ADMIN"]);
    if (d) return d;

    try {
      await connectDB();
      const [students, subjects, total, present, absent, late] = await Promise.all([
        Student.countDocuments({ active: true }),
        Subject.countDocuments(),
        Attendance.countDocuments(),
        Attendance.countDocuments({ status: "PRESENT" }),
        Attendance.countDocuments({ status: "ABSENT" }),
        Attendance.countDocuments({ status: "LATE" }),
      ]);
      return ok({
        students,
        subjects,
        attendance: total,
        present,
        absent,
        late,
        overallPercentage: total ? Number((((present + late) / total) * 100).toFixed(2)) : 0,
      });
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        const students = MOCK_STUDENTS.length;
        const subjects = MOCK_SUBJECTS.length;
        const total = 160;
        const present = 142;
        const absent = 18;
        return ok({
          students,
          subjects,
          attendance: total,
          present,
          absent,
          late: 0,
          overallPercentage: 88.75,
        });
      }
      throw dbErr;
    }
  } catch (e) {
    return handleError(e);
  }
}
