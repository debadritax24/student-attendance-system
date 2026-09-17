// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/redis", () => ({
  getRedis: () => ({
    eval: vi.fn().mockResolvedValue([1, 4, 900000]),
  }),
}));

describe("rateLimit()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("allows request when under limit", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const result = await rateLimit("test-key", 5, 900);
    expect(result.allowed).toBe(true);
  });

  it("returns remaining count", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const result = await rateLimit("test-key", 5, 900);
    expect(typeof result.remaining).toBe("number");
  });
});
