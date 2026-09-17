import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import { createToken } from "@/lib/auth";
import { error, handleError, ok } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const { allowed, remaining, resetMs } = await rateLimit(`login:${ip}`, 5, 900);
    if (!allowed) {
      const retryAfter = Math.ceil((resetMs - Date.now()) / 1000);
      return error(`Too many login attempts. Try again in ${retryAfter} seconds.`, 429);
    }

    const body = schema.parse(await req.json());
    await connectDB();
    const u = await User.findOne({ email: body.email.toLowerCase() });
    if (!u || !(await bcrypt.compare(body.password, u.passwordHash))) {
      return error("Invalid credentials", 401);
    }

    const token = await createToken({ userId: String(u._id), role: u.role, email: u.email });
    const res = ok({ id: u._id, name: u.name, email: u.email, role: u.role, studentId: u.studentId });
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