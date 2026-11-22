import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import { createToken, Role } from "@/lib/auth";
import { error, handleError, ok } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { MOCK_USERS, isMongoConnectionError } from "@/lib/mock-data";

export const runtime = "nodejs";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const { allowed, remaining, resetMs } = await rateLimit(`login:${ip}`, 10, 900);
    if (!allowed) {
      const retryAfter = Math.ceil((resetMs - Date.now()) / 1000);
      return error(`Too many login attempts. Try again in ${retryAfter} seconds.`, 429);
    }

    const body = schema.parse(await req.json());
    const lowerEmail = body.email.toLowerCase();

    let u: any = null;

    try {
      await connectDB();
      u = await User.findOne({ email: lowerEmail });
      if (u && !(await bcrypt.compare(body.password, u.passwordHash))) {
        return error("Invalid credentials", 401);
      }
    } catch (dbErr) {
      if (isMongoConnectionError(dbErr)) {
        // Fallback to mock demo credentials when remote database is unreachable
        const mockUser = MOCK_USERS.find((m) => m.email.toLowerCase() === lowerEmail);
        if (mockUser && (await bcrypt.compare(body.password, mockUser.passwordHash))) {
          u = mockUser;
        } else if (mockUser) {
          return error("Invalid credentials", 401);
        } else {
          return handleError(dbErr);
        }
      } else {
        throw dbErr;
      }
    }

    if (!u) {
      return error("Invalid credentials", 401);
    }

    const token = await createToken({
      userId: String(u._id),
      role: u.role as Role,
      email: u.email,
    });
    const res = ok({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      studentId: u.studentId,
    });
    res.cookies.set("attendify_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    return res;
  } catch (e) {
    return handleError(e);
  }
}
