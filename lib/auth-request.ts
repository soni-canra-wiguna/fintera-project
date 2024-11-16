// lib/authMiddleware.ts
import { NextRequest, NextResponse } from "next/server"
import { clerkClient, verifyToken } from "@clerk/nextjs/server"

export class AuthRequest {
  static async tokenWithUserId(userId: string, req: NextRequest) {
    const token = req.headers.get("authorization")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized. User not Found." }, { status: 404 })
    }
    if (!token) {
      return NextResponse.json({ message: "Unauthorized. No token provided." }, { status: 401 })
    }

    // Bisa lakukan validasi token di sini menggunakan Clerk atau library lain
    try {
      const verifiedUser = await verifyToken(token, {})
      if (!verifiedUser || verifiedUser.id != userId) {
        return NextResponse.json({ message: "Unauthorized. Invalid token." }, { status: 401 })
      }
    } catch (error) {
      return NextResponse.json({ message: "Unauthorized. Invalid token." }, { status: 401 })
    }

    return null
  }

  static userId(userId: string) {
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized. User not Found." }, { status: 404 })
    }
  }
}
