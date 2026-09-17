import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

type Role = "CR" | "STUDENT" | "ADMIN";

const publicPaths = ["/login", "/api/auth/login", "/api/auth/logout", "/api/health"];
const staticPaths = ["/_next", "/favicon.ico"];

const roleRoutes: Record<string, Role[]> = {
  "/admin": ["ADMIN"],
  "/cr": ["ADMIN", "CR"],
  "/dashboard": ["ADMIN", "CR", "STUDENT"],
  "/students": ["ADMIN", "CR", "STUDENT"],
  "/subjects": ["ADMIN", "CR", "STUDENT"],
  "/attendance": ["ADMIN", "CR", "STUDENT"],
  "/reports": ["ADMIN", "CR", "STUDENT"],
  "/history": ["ADMIN", "CR", "STUDENT"],
  "/profile": ["ADMIN", "CR", "STUDENT"],
  "/settings": ["ADMIN", "CR", "STUDENT"],
};

const apiRoleRoutes: Record<string, Role[]> = {
  "/api/users": ["ADMIN"],
  "/api/students": ["ADMIN", "CR", "STUDENT"],
  "/api/subjects": ["ADMIN", "CR", "STUDENT"],
  "/api/attendance": ["ADMIN", "CR", "STUDENT"],
  "/api/reports": ["ADMIN", "CR"],
  "/api/stats": ["ADMIN", "CR", "STUDENT"],
  "/api/timetable": ["ADMIN", "CR", "STUDENT"],
};

function getAllowedRoles(pathname: string, isApi: boolean): Role[] | null {
  const routes = isApi ? apiRoleRoutes : roleRoutes;
  for (const [prefix, roles] of Object.entries(routes)) {
    if (pathname === prefix || pathname.startsWith(prefix + "/") || pathname.startsWith(prefix + "?")) {
      return roles;
    }
  }
  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (staticPaths.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "?") || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("attendify_token")?.value;
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const role = payload.role as Role;

    const isApi = pathname.startsWith("/api/");
    const allowedRoles = getAllowedRoles(pathname, isApi);

    if (allowedRoles && !allowedRoles.includes(role)) {
      if (isApi) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
      const fallback = role === "ADMIN" ? "/admin" : role === "CR" ? "/cr" : "/dashboard";
      return NextResponse.redirect(new URL(fallback, req.url));
    }

    const res = NextResponse.next();
    res.headers.set("x-user-id", payload.userId as string);
    res.headers.set("x-user-role", role);
    return res;
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
    }
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("attendify_token");
    return res;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
