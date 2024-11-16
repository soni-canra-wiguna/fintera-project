import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ProductSchema } from "@/schema"
import { Validation } from "@/schema/validation"
import { CreateProductRequest } from "@/types/product"
import { errorResponse } from "@/lib/error-utils"
import { AuthRequest } from "@/lib/auth-request"
import { ProductServicesAPI } from "@/utils/api/product"
import { getQueryParams } from "@/utils/get-query-params"

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const authError = await AuthRequest.token(req)
    if (authError) return authError

    const request: CreateProductRequest = await req.json()
    const response = Validation.validate(ProductSchema.CREATE, request)

    await ProductServicesAPI.create(response)

    return NextResponse.json({ message: "Successfully created Product" }, { status: 201 })
  } catch (error) {
    console.log("[ERROR POST PRODUCTS] : ", error)
    if (error instanceof z.ZodError) {
      return errorResponse({ message: "Validation error", errors: error.errors }, 500)
    }
    return errorResponse("Internal server error", 500)
  }
}

export const GET = async (req: NextRequest, res: NextResponse): Promise<any> => {
  try {
    const userId = req.headers.get("userId") ?? ""
    const authError = await AuthRequest.tokenWithUserId(userId, req)
    if (authError) return authError

    const { page, limit, skip, orderBy } = getQueryParams(req)

    const { products, totalProducts } = await ProductServicesAPI.get(userId, orderBy, skip, limit)

    if (!totalProducts || products.length === 0) {
      return errorResponse({ message: "data not found", data: [] }, 200)
    }

    const response = {
      message: "Products successfully retrieved",
      data: products,
      currentPage: page,
      totalPages: totalProducts / limit,
      totalProductsPerPage: products.length,
      totalProducts,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.log("[ERROR GET PRODUCTS] : ", error)
    return errorResponse("Internal server error", 500)
  }
}
