import { NextRequest } from "next/server"
import { verifyToken } from "@clerk/nextjs/server"
import { errorResponse } from "./error-utils"

export class AuthRequest {
  private static authError(type: "token" | "user") {
    const messages = {
      token: "Unauthorized. No token provided.",
      user: "Unauthorized. User not Found.",
    }
    const statusCodes = {
      token: 401,
      user: 404,
    }

    return errorResponse(messages[type], statusCodes[type])
  }

  private static async validateToken(token: string) {
    try {
      const verifiedToken = await verifyToken(token, {
        jwtKey: process.env.CLERK_JWT_KEY,
        authorizedParties: [process.env.NEXT_PUBLIC_CLERK_FRONTEND_API as string],
      })

      const { exp, iss } = verifiedToken
      const now = Math.floor(Date.now() / 1000) // Current time in seconds

      // Validate expiration
      if (exp && exp < now) {
        throw new Error("Token has expired.")
      }

      // Validate issuer
      if (iss !== process.env.NEXT_PUBLIC_CLERK_FRONTEND_API) {
        throw new Error("Invalid token issuer.")
      }

      return verifiedToken
    } catch (error) {
      console.error("Token verification failed:", error)
      throw new Error("Invalid token.")
    }
  }

  static async tokenWithUserId(userId: string, req: NextRequest) {
    const token = req.headers.get("authorization")?.replace("Bearer ", "").trim()

    if (!userId) {
      return this.authError("user")
    }
    if (!token) {
      return this.authError("token")
    }

    try {
      const { sub } = await this.validateToken(token)

      // Check if userId matches the token's subject
      if (sub !== userId) {
        return errorResponse("Unauthorized. User ID mismatch.", 403)
      }
    } catch (error) {
      return this.authError("token")
    }

    return null // Token and user are valid
  }

  static async token(req: NextRequest) {
    const token = req.headers.get("authorization")?.replace("Bearer ", "").trim()

    if (!token) {
      return this.authError("token")
    }

    try {
      await this.validateToken(token) // No need to return the payload, just validate
    } catch (error) {
      return this.authError("token")
    }

    return null // Token is valid
  }

  static userId(userId: string) {
    if (!userId) {
      return this.authError("user")
    }
    return null // User ID is valid
  }
}
