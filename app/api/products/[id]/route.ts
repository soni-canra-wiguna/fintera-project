import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { ProductSchema } from "@/schema"
import { Validation } from "@/schema/validation"
import { CreateProductRequest } from "@/types/product"

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const userId = req.headers.get("userId") ?? ""
    const token = req.headers.get("authorization")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized. User not Found." }, { status: 404 })
    }
    if (!token) {
      return NextResponse.json({ message: "Unauthorized. No token provided." }, { status: 401 })
    }

    const request: CreateProductRequest = await req.json()
    const response = Validation.validate(ProductSchema.CREATE, request)

    await prisma.product.update({
      where: {
        id,
        userId: userId,
      },
      data: response,
    })

    return NextResponse.json(
      {
        message: "Successfully updated Product",
      },
      { status: 201 },
    )
  } catch (error) {
    console.log("[ERROR PUT PRODUCTS] : ", error)
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

// to update stock
export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const userId = req.headers.get("userId") ?? ""
    const token = req.headers.get("authorization")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized. User not Found." }, { status: 404 })
    }
    if (!token) {
      return NextResponse.json({ message: "Unauthorized. No token provided." }, { status: 401 })
    }

    const request: CreateProductRequest = await req.json()
    const response = Validation.validate(ProductSchema.UPDATE, request)

    await prisma.product.update({
      where: {
        id,
        userId: userId,
      },
      data: response,
    })

    return NextResponse.json(
      {
        message: "Successfully updated Product",
      },
      { status: 201 },
    )
  } catch (error) {
    console.log("[ERROR PATCH PRODUCTS] : ", error)
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

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const userId = req.headers.get("userId") ?? ""
    const token = req.headers.get("authorization")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized. User not Found." }, { status: 404 })
    }
    if (!token) {
      return NextResponse.json({ message: "Unauthorized. No token provided." }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
        userId,
      },
    })

    if (!product) {
      return NextResponse.json(
        {
          message: "product not found",
        },
        {
          status: 404,
        },
      )
    }

    return NextResponse.json(
      {
        message: "Product successfully retrieved",
        data: product,
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    console.log("[ERROR GET PRODUCTS] : ", error)
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    )
  }
}

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const userId = req.headers.get("userId") ?? ""
    const token = req.headers.get("authorization")

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized. User not Found." }, { status: 404 })
    }
    if (!token) {
      return NextResponse.json({ message: "Unauthorized. No token provided." }, { status: 401 })
    }

    await prisma.product.delete({
      where: {
        id,
        userId,
      },
    })

    return NextResponse.json({ message: "product was deleted" }, { status: 200 })
  } catch (error) {
    console.log("[ERROR DELETE PRODUCTS] : ", error)
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    )
  }
}
