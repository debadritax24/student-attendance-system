import { describe, it, expect } from "vitest";
import { requireRole } from "@/lib/auth";

describe("requireRole()", () => {
  it("returns null when role is allowed", () => {
    const result = requireRole({ userId: "1", role: "ADMIN", email: "a@b.com" }, ["ADMIN"]);
    expect(result).toBeNull();
  });

  it("returns 401 error when session is null", async () => {
    const result = requireRole(null, ["ADMIN"]);
    expect(result).not.toBeNull();
    const json = await result!.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Authentication required");
  });

  it("returns 403 error when role is not allowed", async () => {
    const result = requireRole({ userId: "1", role: "STUDENT", email: "a@b.com" }, ["ADMIN"]);
    expect(result).not.toBeNull();
    const json = await result!.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Forbidden");
  });

  it("allows multiple roles", () => {
    expect(requireRole({ userId: "1", role: "CR", email: "a@b.com" }, ["ADMIN", "CR"])).toBeNull();
    expect(requireRole({ userId: "1", role: "ADMIN", email: "a@b.com" }, ["ADMIN", "CR"])).toBeNull();
    expect(requireRole({ userId: "1", role: "STUDENT", email: "a@b.com" }, ["ADMIN", "CR"])).not.toBeNull();
  });

  it("validates all three roles individually", () => {
    const roles = ["ADMIN", "CR", "STUDENT"] as const;
    for (const role of roles) {
      expect(requireRole({ userId: "1", role, email: "a@b.com" }, [role])).toBeNull();
    }
  });

  it("rejects all wrong roles", () => {
    expect(requireRole({ userId: "1", role: "ADMIN", email: "a@b.com" }, ["STUDENT"])).not.toBeNull();
    expect(requireRole({ userId: "1", role: "CR", email: "a@b.com" }, ["ADMIN"])).not.toBeNull();
    expect(requireRole({ userId: "1", role: "STUDENT", email: "a@b.com" }, ["CR"])).not.toBeNull();
  });
});
