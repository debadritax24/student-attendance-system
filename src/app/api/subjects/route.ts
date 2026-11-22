import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";
import { getSession, requireRole } from "@/lib/auth";
import { subjectCreate } from "@/validation";
import { ok, handleError } from "@/lib/http";
import { pagination } from "@/lib/query";
import { escapeRegex } from "@/lib/regex";
import { MOCK_SUBJECTS, isMongoConnectionError } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const s = await getSession(req);
    const d = requireRole(s, ["CR", "STUDENT", "ADMIN"]);
    if (d) return d;

    const p = pagination(req.nextUrl.searchParams);
    const q = req.nextUrl.searchParams.get("search");
    const filter = q
      ? {
          $or: [
            { name: new RegExp(escapeRegex(q), "i") },
            { code: new RegExp(escapeRegex(q), "i") },
          ],
        }
      : {};

    try {
      await connectDB();
      const [items, total] = await Promise.all([
        Subject.find(filter).skip(p.skip).limit(p.limit).sort({ name: 1 }),
        Subject.countDocuments(filter),
      ]);
      return ok({ items, total, page: p.page, limit: p.limit });
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        let items = [...MOCK_SUBJECTS];
        if (q) {
          const lq = q.toLowerCase();
          items = items.filter(
            (sub) => sub.name.toLowerCase().includes(lq) || sub.code.toLowerCase().includes(lq)
          );
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
    const parsed = subjectCreate.parse(await req.json());
    try {
      await connectDB();
      return ok(
        await Subject.create({ ...parsed, createdBy: s!.userId }),
        201
      );
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        const newSub = {
          _id: `mock-sub-${Date.now()}`,
          ...parsed,
          department: (parsed as any).department || "CSE",
          semester: (parsed as any).semester || 3,
          section: (parsed as any).section || "E",
          createdBy: s!.userId,
        };
        MOCK_SUBJECTS.push(newSub as any);
        return ok(newSub, 201);
      }
      throw dbErr;
    }
  } catch (e) {
    return handleError(e);
  }
}
