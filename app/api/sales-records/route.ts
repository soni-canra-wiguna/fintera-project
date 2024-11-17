import { AuthRequest } from "@/lib/auth-request"
import { errorResponse } from "@/lib/error-utils"
import { SalesRecordSchema } from "@/schema"
import { Validation } from "@/schema/validation"
import { CreateSalesRecordRequest } from "@/types/sales-record"
import { SalesRecordServicesAPI } from "@/utils/api/sales-record"
import { getQueryParams } from "@/utils/get-query-params"
import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import * as z from "zod"

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const authError = await AuthRequest.token(req)
    if (authError) return authError

    const request: CreateSalesRecordRequest[] = await req.json()
    const response = Validation.validate(SalesRecordSchema.ARRAY_CREATE, request)

    if (!Array.isArray(response) || response.length === 0) {
      return errorResponse("Invalid request path", 400)
    }

    await SalesRecordServicesAPI.create(response)

    return NextResponse.json({ message: "Successfully created sale record" }, { status: 201 })
  } catch (error) {
    console.log("[ERROR POST SALES RECORDS] : ", error)
    if (error instanceof z.ZodError) {
      return errorResponse({ message: "Validation error", errors: error.errors }, 400)
    }
    return errorResponse("Internal server error", 500)
  }
}

export const GET = async (req: NextRequest, res: NextResponse): Promise<any> => {
  try {
    const userId = req.headers.get("userId") ?? ""
    const authError = await AuthRequest.token(req)

    if (authError) return authError

    const { from, to, category, orderBySalesRecord: orderBy } = getQueryParams(req)

    let filters = []

    if (category) {
      filters.push({
        category: {
          contains: category,
          mode: "insensitive" as Prisma.QueryMode,
        },
      })
    }

    if (from && to) {
      const fromDate = new Date(from)
      const toDate = new Date(to)
      toDate.setUTCHours(23, 59, 59, 999)
      filters.push({
        created_at: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      })
    }

    if (from && to && category) {
      const fromDate = new Date(from)
      const toDate = new Date(to)
      toDate.setUTCHours(23, 59, 59, 999)
      filters.push({
        created_at: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
        category: {
          contains: category,
          mode: "insensitive" as Prisma.QueryMode,
        },
      })
    }

    const { salesRecords, totalSalesRecords } = await SalesRecordServicesAPI.get(
      userId,
      orderBy,
      filters,
    )

    if (!totalSalesRecords || salesRecords.length === 0) {
      return errorResponse({ message: "data not found", data: [] }, 200)
    }

    // statistic response start

    const totalSales = salesRecords.reduce((acc, curr) => {
      return acc + curr.quantity
    }, 0)
    const totalRevenue = salesRecords.reduce((acc, curr) => {
      return acc + curr.total_price
    }, 0)
    const totalTransactions = totalSalesRecords
    const averageSalePerTransaction = Math.round(totalSales / totalTransactions)
    const averageRevenuePerTransaction = totalRevenue / totalTransactions
    // Calculate sales and revenue by category
    const salesByCategory = salesRecords.reduce(
      (acc, curr) => {
        const category = curr.category || "Uncategorized"
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += curr.quantity
        return acc
      },
      {} as Record<string, number>,
    )

    const revenueByCategory = salesRecords.reduce(
      (acc, curr) => {
        const category = curr.category || "Uncategorized"
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += curr.total_price
        return acc
      },
      {} as Record<string, number>,
    )

    const salesAndRevenueByCategory = salesRecords.reduce(
      (acc, curr) => {
        const category = curr.category || "Uncategorized"
        if (!acc[category]) {
          acc[category] = {
            label: category,
            quantity: 0,
            total_price: 0,
          }
        }
        acc[category].quantity += curr.quantity
        acc[category].total_price += curr.total_price

        return acc
      },
      {} as Record<string, { label: string; quantity: number; total_price: number }>,
    )
    const salesAndRevenueByCategoryArray = Object.values(salesAndRevenueByCategory).sort(
      (a, b) => b.quantity - a.quantity,
    )

    // Calculate sales and revenue by month
    const salesByMonth = salesRecords.reduce(
      (acc, curr) => {
        const month = curr.created_at.toLocaleString("default", {
          month: "long",
        })
        if (!acc[month]) {
          acc[month] = 0
        }
        acc[month] += curr.quantity
        return acc
      },
      {} as Record<string, number>,
    )

    const revenueByMonth = salesRecords.reduce(
      (acc, curr) => {
        const month = curr.created_at.toLocaleString("default", {
          month: "long",
        })
        if (!acc[month]) {
          acc[month] = 0
        }
        acc[month] += curr.total_price
        return acc
      },
      {} as Record<string, number>,
    )

    // Get top selling products
    const topSellingProducts = salesRecords
      .reduce(
        (acc, curr) => {
          const product = acc.find((p) => p.product === curr.title)
          if (product) {
            product.quantity += curr.quantity
          } else {
            acc.push({ product: curr.title, quantity: curr.quantity })
          }
          return acc
        },
        [] as { product: string; quantity: number }[],
      )
      .sort((a, b) => b.quantity - a.quantity)

    const statisticResponse = {
      totalSales,
      totalRevenue,
      totalTransactions,
      averageSalePerTransaction,
      averageRevenuePerTransaction,
      salesByCategory,
      salesAndRevenueByCategory: salesAndRevenueByCategoryArray,
      revenueByCategory,
      salesByMonth,
      revenueByMonth,
      topSellingProducts,
    }

    const response = {
      message: "records successfully retrieved",
      data: salesRecords,
      statistic: statisticResponse,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.log("[ERROR GET SALES RECORDS] : ", error)
    return errorResponse("Internal server error", 500)
  }
}

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  try {
    const userId = req.headers.get("userId") ?? ""
    const authError = await AuthRequest.tokenWithUserId(userId, req)
    if (authError) return authError

    await SalesRecordServicesAPI.deleteAll(userId)

    return NextResponse.json("successfully deleted", { status: 200 })
  } catch (error) {
    console.log("[ERROR DELETE SALES RECORDS] : ", error)
    return errorResponse("Internal server error", 500)
  }
}
