import prisma from "@/lib/prisma"
import { SalesRecordSchema } from "@/schema"
import { Validation } from "@/schema/validation"
import { CreateSalesRecordRequest } from "@/types/sales-record"
import { getSearchParams } from "@/utils/get-search-params"
import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import * as z from "zod"

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const token = req.headers.get("authorization")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized. No token provided." }, { status: 401 })
    }

    const request: CreateSalesRecordRequest[] = await req.json()
    const response = Validation.validate(SalesRecordSchema.ARRAY_CREATE, request)

    if (!Array.isArray(response) || response.length === 0) {
      return NextResponse.json(
        {
          message: "invalid request path",
        },
        {
          status: 400,
        },
      )
    }

    await prisma.salesRecord.createMany({
      data: response,
    })

    return NextResponse.json(
      {
        message: "Successfully created sale record",
      },
      { status: 201 },
    )
  } catch (error) {
    console.log("[ERROR POST SALES RECORDS] : ", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      {
        message: "internal server error",
      },
      {
        status: 500,
      },
    )
  }
}

export const GET = async (req: NextRequest, res: NextResponse): Promise<any> => {
  try {
    const userId = req.headers.get("userId") ?? ""
    const token = req.headers.get("authorization")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized. User not Found." }, { status: 404 })
    }
    if (!token) {
      return NextResponse.json({ message: "Unauthorized. No token provided." }, { status: 401 })
    }

    const from = getSearchParams(req, "from") ?? "" // createdAt
    const to = getSearchParams(req, "to") ?? "" // createdAt
    const category = getSearchParams(req, "category") // category
    const sortBy = getSearchParams(req, "sortBy")

    let filters = []
    let orderBy = {}

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
        createdAt: {
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
        createdAt: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
        category: {
          contains: category,
          mode: "insensitive" as Prisma.QueryMode,
        },
      })
    }

    switch (sortBy) {
      case "quantity-low":
        orderBy = { quantity: "asc" }
        break
      case "quantity-high":
        orderBy = { quantity: "desc" }
        break
      case "date-desc":
        orderBy = { createdAt: "desc" }
        break
      case "date-asc":
        orderBy = { createdAt: "asc" }
        break
      default:
        orderBy = { createdAt: "desc" }
    }

    const salesRecords = await prisma.salesRecord.findMany({
      where: {
        userId,
        AND: filters,
      },
      orderBy: orderBy || { createdAt: "desc" },
    })

    const totalSalesRecords = await prisma.salesRecord.count({
      where: {
        userId,
        AND: filters,
      },
    })

    const productNotFound = salesRecords.length === 0

    if (!totalSalesRecords || productNotFound) {
      return NextResponse.json(
        {
          message: "data not found",
          data: [],
        },
        { status: 200 },
      )
    }

    // statistic response start

    const totalSales = salesRecords.reduce((acc, curr) => {
      return acc + curr.quantity
    }, 0)
    const totalRevenue = salesRecords.reduce((acc, curr) => {
      return acc + curr.totalPrice
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
        acc[category] += curr.totalPrice
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
            totalPrice: 0,
          }
        }
        acc[category].quantity += curr.quantity
        acc[category].totalPrice += curr.totalPrice

        return acc
      },
      {} as Record<string, { label: string; quantity: number; totalPrice: number }>,
    )
    const salesAndRevenueByCategoryArray = Object.values(salesAndRevenueByCategory).sort(
      (a, b) => b.quantity - a.quantity,
    )

    // Calculate sales and revenue by month
    const salesByMonth = salesRecords.reduce(
      (acc, curr) => {
        const month = curr.createdAt.toLocaleString("default", {
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
        const month = curr.createdAt.toLocaleString("default", {
          month: "long",
        })
        if (!acc[month]) {
          acc[month] = 0
        }
        acc[month] += curr.totalPrice
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

    // statistic response end

    const response = {
      message: "records successfully retrieved",
      data: salesRecords,
      statistic: statisticResponse,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.log("[ERROR GET SALES RECORDS] : ", error)
    return NextResponse.json(
      {
        message: "internal server error",
      },
      {
        status: 500,
      },
    )
  }
}

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  try {
    const userId = req.headers.get("userId") ?? ""
    const token = req.headers.get("authorization")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized. User not Found." }, { status: 404 })
    }
    if (!token) {
      return NextResponse.json({ message: "Unauthorized. No token provided." }, { status: 401 })
    }

    await prisma.salesRecord.deleteMany({
      where: {
        userId: userId,
      },
    })

    return NextResponse.json("successfully deleted", {
      status: 200,
    })
  } catch (error) {
    console.log("[ERROR DELETE SALES RECORDS] : ", error)
    return NextResponse.json(
      {
        message: "internal server error",
      },
      {
        status: 500,
      },
    )
  }
}
