import { describe, it, expect } from "vitest";
import { ok, error, handleError } from "@/lib/http";
import { ZodError } from "zod";

describe("ok()", () => {
  it("returns success response with data", () => {
    const res = ok({ name: "test" });
    expect(res.status).toBe(200);
  });

  it("returns custom status code", () => {
    const res = ok({ created: true }, 201);
    expect(res.status).toBe(201);
  });
});

describe("error()", () => {
  it("returns error response with message", () => {
    const res = error("Something went wrong", 400);
    expect(res.status).toBe(400);
  });

  it("returns 500 by default", () => {
    const res = error("Internal error");
    expect(res.status).toBe(500);
  });

  it("includes details when provided", () => {
    const res = error("Validation failed", 400, [{ field: "email" }]);
    expect(res.status).toBe(400);
  });
});

describe("handleError()", () => {
  it("handles ZodError", () => {
    try {
      const { z } = require("zod");
      z.string().parse(123);
    } catch (e) {
      const res = handleError(e);
      expect(res.status).toBe(400);
    }
  });

  it("handles generic Error", () => {
    const res = handleError(new Error("test error"));
    expect(res.status).toBe(500);
  });

  it("handles unknown values", () => {
    const res = handleError("string error");
    expect(res.status).toBe(500);
  });
});
