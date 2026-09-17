import { getRedis } from "./redis";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export async function rateLimit(
  key: string,
  maxRequests: number = 5,
  windowSeconds: number = 900
): Promise<RateLimitResult> {
  const redis = getRedis();
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const resetMs = now + windowMs;

  const luaScript = `
    local key = KEYS[1]
    local max = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])

    local current = redis.call("GET", key)
    if current and tonumber(current) >= max then
      local ttl = redis.call("PTTL", key)
      return {0, max - tonumber(current), ttl}
    end

    local new_count = redis.call("INCR", key)
    if new_count == 1 then
      redis.call("PEXPIRE", key, window)
    end

    local ttl = redis.call("PTTL", key)
    return {1, max - new_count, ttl}
  `;

  try {
    const result = (await redis.eval(luaScript, 1, key, String(maxRequests), String(windowMs), String(now))) as [
      number,
      number,
      number
    ];

    return {
      allowed: result[0] === 1,
      remaining: Math.max(0, result[1]),
      resetMs: result[2] > 0 ? now + result[2] : resetMs,
    };
  } catch {
    return { allowed: true, remaining: maxRequests, resetMs };
  }
}
