import { NextRequest, NextResponse } from "next/server"
import { errorResponse } from "@/lib/error-utils"
import { AuthRequest } from "@/lib/auth-request"
import { ProductServicesAPI } from "@/utils/api/product"
import { limitRequestAPI } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const userId = req.headers.get("userId") ?? ""

    const authError = await AuthRequest.tokenWithUserId(userId, req)
    if (authError) return authError

    const limitError = await limitRequestAPI({ limitRequest: 20, userId })
    if (limitError) return limitError

    const categories = await ProductServicesAPI.getCategories(userId)

    return NextResponse.json(
      { message: "Category successfully retrieved", data: categories },
      { status: 200 },
    )
  } catch (error) {
    console.log("[ERROR GET CATEGORIES] : ", error)
    return errorResponse("Internal server error", 500)
  }
}
