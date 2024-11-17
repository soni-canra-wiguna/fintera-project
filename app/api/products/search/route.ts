import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { AuthRequest } from "@/lib/auth-request"
import { getQueryParams } from "@/utils/get-query-params"
import { errorResponse } from "@/lib/error-utils"
import { ProductServicesAPI } from "@/utils/api/product"

export const dynamic = "force-dynamic"

export type SearchByType = "productName" | "sku" | "category"

const searchFilter = (query: string, searchBy: SearchByType) => {
  let filters = []

  if (searchBy === "productName") {
    filters.push({
      title: {
        contains: query,
        mode: "insensitive" as Prisma.QueryMode,
      },
    })
  }
  if (searchBy === "sku") {
    filters.push({
      sku: {
        contains: query.replace(/\s+/g, "-"),
        mode: "insensitive" as Prisma.QueryMode,
      },
    })
  }
  if (searchBy === "category") {
    filters.push({
      category: {
        contains: query,
        mode: "insensitive" as Prisma.QueryMode,
      },
    })
  }

  return filters
}

export const GET = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("userId") ?? ""

    const authError = await AuthRequest.tokenWithUserId(userId, req)
    if (authError) return authError

    const { query, searchBy } = getQueryParams(req)
    const filters = searchFilter(query, searchBy)

    const products = await ProductServicesAPI.search(userId, filters)

    if (query && products.length === 0) {
      return NextResponse.json({ message: "search results not found", data: [] }, { status: 200 })
    }

    return NextResponse.json(
      {
        message: "Search results successfully retrieved",
        data: products,
      },
      { status: 200 },
    )
  } catch (error) {
    console.log("[ERROR GET SEARCH RESULTS]", error)
    return errorResponse("Internal server error", 500)
  }
}
