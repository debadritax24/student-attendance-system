import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function withCors(res: NextResponse, origin = process.env.FRONTEND_URL || "http://localhost:3000") {
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export function ok(data: unknown, status = 200) {
  return withCors(NextResponse.json({ success: true, data }, { status }));
}
export function error(message: string, status = 500, details?: unknown) {
  return withCors(NextResponse.json({ success: false, error: message, ...(details ? { details } : {}) }, { status }));
}
export function handleError(e: unknown) {
  if (e instanceof ZodError) return error("Validation failed", 400, e.issues);
  if (e instanceof Error && e.name === "ValidationError") return error(e.message, 400);
  if (e instanceof Error && e.name === "CastError") return error("Invalid resource ID", 400);
  console.error(e);
  return error("Internal server error", 500);
}