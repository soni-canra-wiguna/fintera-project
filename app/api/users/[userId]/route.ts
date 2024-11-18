import { NextRequest, NextResponse } from "next/server"
import { AuthRequest } from "@/lib/auth-request"
import { UserServicesAPI } from "@/utils/api/user"
import { errorResponse } from "@/lib/error-utils"
import { clerkClient } from "@clerk/nextjs/server"
import { limitRequestAPI } from "@/lib/rate-limit"

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const { userId } = params
    const authError = await AuthRequest.tokenWithUserId(userId, req)
    if (authError) return authError

    const limitError = await limitRequestAPI({ userId })
    if (limitError) return limitError

    const user = await UserServicesAPI.get(userId)

    return NextResponse.json({ message: "user was retrieved", data: user }, { status: 200 })
  } catch (error) {
    console.log("[ERROR GET USER] : ", error)
    return errorResponse("Internal server error", 500)
  }
}

export const DELETE = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const { userId } = params
    const authError = await AuthRequest.tokenWithUserId(userId, req)
    if (authError) return authError

    const limitError = await limitRequestAPI({ limitRequest: 5, userId })
    if (limitError) return limitError

    // delete user from clerk
    await clerkClient().users.deleteUser(userId)
    await UserServicesAPI.delete(userId)

    return NextResponse.json({ message: "user deleted" }, { status: 200 })
  } catch (error) {
    console.log("[ERROR DELETE USER] : ", error)
    return errorResponse("Internal server error", 500)
  }
}
