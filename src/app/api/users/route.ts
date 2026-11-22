import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getSession, requireRole } from "@/lib/auth";
import { userCreate } from "@/validation";
import { ok, handleError } from "@/lib/http";
import { pagination } from "@/lib/query";
import { escapeRegex } from "@/lib/regex";
import { MOCK_USERS, isMongoConnectionError } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const s = await getSession(req);
    const denied = requireRole(s, ["ADMIN"]);
    if (denied) return denied;

    try {
      await connectDB();
      const { page, limit, skip } = pagination(req.nextUrl.searchParams);
      const q = req.nextUrl.searchParams.get("search");
      const filter = q
        ? {
            $or: [
              { name: new RegExp(escapeRegex(q), "i") },
              { email: new RegExp(escapeRegex(q), "i") },
            ],
          }
        : {};
      const [items, total] = await Promise.all([
        User.find(filter)
          .select("-passwordHash")
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        User.countDocuments(filter),
      ]);
      return ok({ items, page, limit, total });
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        const items = MOCK_USERS.map(({ passwordHash: _passwordHash, ...u }) => u);
        return ok({ items, page: 1, limit: 10, total: items.length });
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
    const denied = requireRole(s, ["ADMIN"]);
    if (denied) return denied;
    const b = userCreate.parse(await req.json());

    try {
      await connectDB();
      const u = await User.create({
        ...b,
        passwordHash: await bcrypt.hash(b.password, 12),
      });
      return ok(
        {
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          studentId: u.studentId,
        },
        201
      );
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        const newMock = {
          _id: `mock-user-${Date.now()}`,
          name: b.name,
          email: b.email,
          role: b.role,
          studentId: b.studentId || null,
        };
        MOCK_USERS.push({
          ...newMock,
          passwordHash: bcrypt.hashSync(b.password, 10),
        });
        return ok(newMock, 201);
      }
      throw dbErr;
    }
  } catch (e) {
    return handleError(e);
  }
}
