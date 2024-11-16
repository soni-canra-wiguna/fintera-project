import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { ProductSchema } from "@/schema"
import { Validation } from "@/schema/validation"
import { CreateProductRequest } from "@/types/product"

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const token = req.headers.get("authorization")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized. No token provided." }, { status: 401 })
    }

    const request: CreateProductRequest = await req.json()
    const response = Validation.validate(ProductSchema.CREATE, request)

    await prisma.product.create({
      data: response,
    })

    return NextResponse.json(
      {
        message: "Successfully created Product",
      },
      { status: 201 },
    )
  } catch (error) {
    console.log("[ERROR POST PRODUCTS] : ", error)
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
    const token = req.headers.get("authorization")
    const userId = req.headers.get("userId") ?? ""

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized. User not Found." }, { status: 404 })
    }
    if (!token) {
      return NextResponse.json({ message: "Unauthorized. No token provided." }, { status: 401 })
    }

    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1")
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20")
    const skip = (page - 1) * limit
    const sortBy = req.nextUrl.searchParams.get("sortBy")

    let orderBy = {}
    switch (sortBy) {
      case "new":
        orderBy = { createdAt: "desc" }
        break
      case "old":
        orderBy = { createdAt: "asc" }
        break
      case "a-z":
        orderBy = { title: "asc" }
        break
      case "z-a":
        orderBy = { title: "desc" }
        break
      case "price-high":
        orderBy = { price: "desc" }
        break
      case "price-low":
        orderBy = { price: "asc" }
        break
      case "stock-high":
        orderBy = { stock: "desc" }
        break
      case "stock-low":
        orderBy = { stock: "asc" }
        break
      default:
        orderBy = { createdAt: "desc" }
    }

    const products = await prisma.product.findMany({
      where: {
        userId,
      },
      orderBy,
      skip: skip,
      take: limit,
    })

    const totalProducts = await prisma.product.count({
      where: {
        userId,
      },
    })

    const productNotFound = products.length === 0

    if (!totalProducts || productNotFound) {
      return NextResponse.json(
        {
          message: "data not found",
          data: [],
        },
        { status: 200 },
      )
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
