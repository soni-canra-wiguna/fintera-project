import { NextRequest } from "next/server"
import { createClerkClient, verifyToken } from "@clerk/nextjs/server"
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

  private static async validateToken(token: string, req: NextRequest) {
    try {
      const isDevelopment = process.env.NODE_ENV === "development"
      const authorizedParty = isDevelopment
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_CLERK_FRONTEND_API

      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      })

      const { isSignedIn } = await clerkClient.authenticateRequest(req, {
        jwtKey: process.env.CLERK_JWT_KEY,
        authorizedParties: [authorizedParty as string],
      })

      return isSignedIn
    } catch (error) {
      console.error("Token verification failed:", error)
      throw new Error("Invalid token.")
    }
  }

  static async tokenWithUserId(userId: string, req: NextRequest) {
    // const token = req.headers.get("authorization")?.replace("Bearer ", "").trim()
    const token = req.headers.get("authorization")

    if (!userId) {
      return this.authError("user")
    }
    if (!token) {
      return this.authError("token")
    }

    // try {
    // const isSignedIn = await this.validateToken(token, req)

    //   if (!isSignedIn) return this.authError("token")
    // } catch (error) {
    //   return this.authError("token")
    // }

    return null // Token and user are valid
  }

  static async token(req: NextRequest) {
    const token = req.headers.get("authorization")

    if (!token) {
      return this.authError("token")
    }

    // try {
    //   const isSignedIn = await this.validateToken(token, req)

    //   if (!isSignedIn) return this.authError("token")
    // } catch (error) {
    //   return this.authError("token")
    // }

    return null // Token is valid
  }

  static userId(userId: string) {
    if (!userId) {
      return this.authError("user")
    }
    return null // User ID is valid
  }
}
