import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ProductSchema } from "@/schema"
import { Validation } from "@/schema/validation"
import { CreateProductRequest } from "@/types/product"
import { errorResponse } from "@/lib/error-utils"
import { AuthRequest } from "@/lib/auth-request"
import { ProductServicesAPI } from "@/utils/api/product"
import { getQueryParams } from "@/utils/get-query-params"
import { SalesRecordServicesAPI } from "@/utils/api/sales-record"

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const userId = req.headers.get("userId") ?? ""

    const authError = await AuthRequest.tokenWithUserId(userId, req)
    if (authError) return authError

    const request: CreateProductRequest = await req.json()
    const response = Validation.validate(ProductSchema.CREATE, request)

    const { id: productId } = await ProductServicesAPI.create(response)

    /*  every product created will be added to the sales record. */
    await SalesRecordServicesAPI.create({
      title: response.title,
      image: response.image!,
      category: response.category,
      price_purchase: response.price_purchase,
      price_sale: 0, // !the selling price should be empty, if 0 is afraid someone will assume the price is free.
      quantity: response.stock,
      total_price: response.stock * response.price_purchase,
      transaction_type: "EXPENSE",
      sku: response.sku!,
      user_id: userId,
      product_id: productId,
    })

    return NextResponse.json({ message: "Successfully created Product" }, { status: 201 })
  } catch (error) {
    console.log("[ERROR POST PRODUCTS] : ", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 },
      )
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
      return NextResponse.json({ message: "data not found", data: [] }, { status: 200 })
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
