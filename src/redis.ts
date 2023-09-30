import config from "./config";
import { Ratelimit } from "@upstash/ratelimit";
import Redis from "ioredis";

/**
 * Global Redis client
 */
export const redis = new Redis(config.REDIS_URL);

/**
 * Global Ratelimit client
 */
const cache = new Map();

// Adapter required to make ioredis compatible with @upstash/ratelimit
const adapterRedis = {
  sadd: <TData>(key: string, ...members: TData[]) =>
    redis.sadd(key, ...members.map((m) => String(m))),
  eval: async <TArgs extends unknown[], TData = unknown>(
    script: string,
    keys: string[],
    args: TArgs
  ) =>
    redis.eval(
      script,
      keys.length,
      ...keys,
      ...(args ?? []).map((a) => String(a))
    ) as Promise<TData>,
};

export const ratelimit = new Ratelimit({
  redis: adapterRedis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: false,
  prefix: "@upstash/ratelimit",
  ephemeralCache: cache,
});
