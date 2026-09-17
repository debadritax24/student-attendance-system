import Redis from "ioredis";
import logger from "./logger";

let redis: Redis | null = null;
let redisAvailable = true;

export function getRedis(): Redis | null {
  if (!redisAvailable) return null;
  if (!redis) {
    const url = process.env.REDIS_URL;
    if (!url) {
      logger.warn("REDIS_URL not set — rate limiting disabled");
      redisAvailable = false;
      return null;
    }
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn("Redis unreachable — rate limiting disabled");
          redisAvailable = false;
          return null;
        }
        return Math.min(times * 50, 2000);
      },
      lazyConnect: true,
      connectTimeout: 3000,
    });
    redis.on("error", () => {
      redisAvailable = false;
    });
    redis.on("connect", () => {
      redisAvailable = true;
    });
  }
  return redis;
}
