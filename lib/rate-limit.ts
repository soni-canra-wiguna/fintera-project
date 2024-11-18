import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "./redis"
import { NextRequest, NextResponse } from "next/server"

export const limitRequestAPI = async ({
  limitRequest = 50,
  userId,
}: {
  limitRequest?: number
  userId: string
}) => {
  const rateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limitRequest, "1 m"),
    analytics: true,
    enableProtection: true,
    timeout: 5000,
  })

  const { success, limit, reset, remaining } = await rateLimit.limit(userId)

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000)

    return NextResponse.json(
      {
        message: "Rate limit exceeded. Please wait before trying again.",
        details: {
          limit: `${limit} requests per minute`,
          remainings: remaining,
          retryAfter: retryAfter > 0 ? `${retryAfter} seconds` : "a few moments",
        },
      },
      { status: 429 },
    )
  }

  return null
}
