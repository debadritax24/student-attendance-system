import { NextResponse } from "next/server";
import { ZodError } from "zod";
import logger from "./logger";

const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

export function withCors(res: NextResponse, origin = allowedOrigin) {
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
  if (e instanceof Error && "code" in e && (e as any).code === 11000) {
    const field = Object.keys((e as any).keyPattern || {})[0] || "resource";
    return error(`Duplicate ${field}: this value already exists`, 409);
  }
  logger.error({ err: e }, "Unhandled API error");
  return error("Internal server error", 500);
}