import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import { getSession, requireRole } from "@/lib/auth";
import { studentCreate } from "@/validation";
import { ok, handleError } from "@/lib/http";
import { pagination } from "@/lib/query";
import { escapeRegex } from "@/lib/regex";
import { MOCK_STUDENTS, isMongoConnectionError } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const s = await getSession(req);
    const d = requireRole(s, ["CR", "STUDENT", "ADMIN"]);
    if (d) return d;

    const p = pagination(req.nextUrl.searchParams);
    const sp = req.nextUrl.searchParams;
    const filter: any = {};
    for (const k of ["department", "section"]) {
      if (sp.get(k)) filter[k] = sp.get(k);
    }
    if (sp.get("semester")) filter.semester = Number(sp.get("semester"));
    if (sp.get("search")) {
      const escaped = escapeRegex(sp.get("search")!);
      filter.$or = [{ name: new RegExp(escaped, "i") }, { rollNumber: new RegExp(escaped, "i") }];
    }

    try {
      await connectDB();
      const [items, total] = await Promise.all([
        Student.find(filter).skip(p.skip).limit(p.limit).sort({ name: 1 }),
        Student.countDocuments(filter),
      ]);
      return ok({ items, total, page: p.page, limit: p.limit });
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        let items = [...MOCK_STUDENTS];
        const search = sp.get("search");
        if (search) {
          const q = search.toLowerCase();
          items = items.filter(
            (st) => st.name.toLowerCase().includes(q) || st.rollNumber.toLowerCase().includes(q)
          );
        }
        if (sp.get("department")) {
          items = items.filter((st) => st.department === sp.get("department"));
        }
        if (sp.get("semester")) {
          items = items.filter((st) => st.semester === Number(sp.get("semester")));
        }
        if (sp.get("section")) {
          items = items.filter((st) => st.section === sp.get("section"));
        }
        const total = items.length;
        const paginated = items.slice(p.skip, p.skip + p.limit);
        return ok({ items: paginated, total, page: p.page, limit: p.limit });
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
    const parsed = studentCreate.parse(await req.json());
    try {
      await connectDB();
      return ok(await Student.create(parsed), 201);
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        const newStudent = {
          _id: `mock-stu-${Date.now()}`,
          ...parsed,
          enrollmentNumber: `AU/2025/${Math.floor(100000 + Math.random() * 900000)}`,
          active: true,
          attendancePercentage: 85,
        };
        MOCK_STUDENTS.unshift(newStudent as any);
        return ok(newStudent, 201);
      }
      throw dbErr;
    }
  } catch (e) {
    return handleError(e);
  }
}
