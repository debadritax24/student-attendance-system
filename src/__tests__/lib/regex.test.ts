import { describe, it, expect } from "vitest";
import { escapeRegex } from "@/lib/regex";

describe("escapeRegex", () => {
  it("escapes special regex characters", () => {
    expect(escapeRegex("hello.world")).toBe("hello\\.world");
    expect(escapeRegex("a+b*c")).toBe("a\\+b\\*c");
    expect(escapeRegex("[test]")).toBe("\\[test\\]");
    expect(escapeRegex("(foo|bar)")).toBe("\\(foo\\|bar\\)");
    expect(escapeRegex("price: $5.00")).toBe("price: \\$5\\.00");
  });

  it("leaves normal strings unchanged", () => {
    expect(escapeRegex("hello world")).toBe("hello world");
    expect(escapeRegex("abc123")).toBe("abc123");
    expect(escapeRegex("CSE Department")).toBe("CSE Department");
  });

  it("handles empty strings", () => {
    expect(escapeRegex("")).toBe("");
  });

  it("prevents ReDoS attacks", () => {
    const malicious = "..".repeat(100);
    const escaped = escapeRegex(malicious);
    expect(escaped).not.toContain("..");
    expect(new RegExp(escaped, "i").test("test")).toBe(false);
  });
});
