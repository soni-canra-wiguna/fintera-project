import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "./redis"

export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  enableProtection: true,
  prefix: "@upstash/ratelimit",
})
