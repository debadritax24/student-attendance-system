import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { error } from "./http";

export type Role = "CR" | "STUDENT" | "ADMIN";
export type Session = { userId: string; role: Role; email: string };

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function createToken(session: Session) {
  return new SignJWT(session).setProtectedHeader({ alg: "HS256" })
    .setIssuedAt().setExpirationTime("7d").sign(secret());
}

export async function getSession(req?: NextRequest): Promise<Session | null> {
  const token = req?.cookies.get("attendify_token")?.value ?? (await cookies()).get("attendify_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { userId: String(payload.userId), role: payload.role as Role, email: String(payload.email) };
  } catch { return null; }
}

export function requireRole(session: Session | null, roles: Role[]) {
  if (!session) return error("Authentication required", 401);
  if (!roles.includes(session.role)) return error("Forbidden", 403);
  return null;
}