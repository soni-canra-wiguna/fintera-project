import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ProductSchema } from "@/schema"
import { Validation } from "@/schema/validation"
import { CreateProductRequest } from "@/types/product"
import { errorResponse } from "@/lib/error-utils"
import { AuthRequest } from "@/lib/auth-request"
import { ProductServicesAPI } from "@/utils/api/product"
import { ParamsAPI } from "@/types"
import { limitRequestAPI } from "@/lib/rate-limit"

export const PUT = async (req: NextRequest, { params }: ParamsAPI) => {
  try {
    const { id } = params
    const userId = req.headers.get("userId") ?? ""

    const authError = await AuthRequest.tokenWithUserId(userId, req)
    if (authError) return authError

    const limitError = await limitRequestAPI({ userId })
    if (limitError) return limitError

    const request: CreateProductRequest = await req.json()
    const response = Validation.validate(ProductSchema.CREATE, request)

    await ProductServicesAPI.update(id, userId, response)

    return NextResponse.json({ message: "Successfully updated Product" }, { status: 201 })
  } catch (error) {
    console.log("[ERROR PUT PRODUCTS] : ", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 },
      )
    }
    return errorResponse("Internal server error", 500)
  }
}

// to update stock
export const PATCH = async (req: NextRequest, { params }: ParamsAPI) => {
  try {
    const { id } = params
    const userId = req.headers.get("userId") ?? ""

    const authError = await AuthRequest.tokenWithUserId(userId, req)
    if (authError) return authError

    const limitError = await limitRequestAPI({ userId })
    if (limitError) return limitError

    const request: CreateProductRequest = await req.json()
    const response = Validation.validate(ProductSchema.UPDATE, request)

    await ProductServicesAPI.update(id, userId, response)

    return NextResponse.json({ message: "Successfully updated Product" }, { status: 201 })
  } catch (error) {
    console.log("[ERROR PATCH PRODUCTS] : ", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 },
      )
    }
    return errorResponse("Internal server error", 500)
  }
}

export const GET = async (req: NextRequest, { params }: ParamsAPI) => {
  try {
    const { id } = params
    const userId = req.headers.get("userId") ?? ""

    const authError = await AuthRequest.tokenWithUserId(userId, req)
    if (authError) return authError

    const limitError = await limitRequestAPI({ userId })
    if (limitError) return limitError

    const product = await ProductServicesAPI.getSingle(id, userId)

    if (!product) return errorResponse("product not found", 404)

    return NextResponse.json(
      { message: "Product successfully retrieved", data: product },
      { status: 200 },
    )
  } catch (error) {
    console.log("[ERROR GET PRODUCTS] : ", error)
    return errorResponse("Internal server error", 500)
  }
}

export const DELETE = async (req: NextRequest, { params }: ParamsAPI) => {
  try {
    const { id } = params
    const userId = req.headers.get("userId") ?? ""

    const authError = await AuthRequest.tokenWithUserId(userId, req)
    if (authError) return authError

    const limitError = await limitRequestAPI({ limitRequest: 30, userId })
    if (limitError) return limitError

    await ProductServicesAPI.delete(id, userId)

    return NextResponse.json({ message: "product was deleted" }, { status: 200 })
  } catch (error) {
    console.log("[ERROR DELETE PRODUCTS] : ", error)
    return errorResponse("Internal server error", 500)
  }
}
