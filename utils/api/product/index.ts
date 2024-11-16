import prisma from "@/lib/prisma"
import { CreateProductRequest } from "@/types/product"

export class ProductServicesAPI {
  static async create(response: CreateProductRequest) {
    await prisma.product.create({
      data: response,
    })
  }

  static async get(userId: string, orderBy: any, skip: number, limit: number) {
    const productQuery = prisma.product.findMany({
      where: { user_id: userId },
      orderBy,
      skip,
      take: limit,
    })

    const totalCountQuery = prisma.product.count({
      where: { user_id: userId },
    })

    const [products, totalProducts] = await Promise.all([productQuery, totalCountQuery])

    return { products, totalProducts }
  }

  static async update(productId: string, userId: string, response: CreateProductRequest) {
    await prisma.product.update({
      where: {
        id: productId,
        user_id: userId,
      },
      data: response,
    })
  }

  static async getSingle(productId: string, userId: string) {
    return await prisma.product.findUnique({
      where: {
        id: productId,
        user_id: userId,
      },
    })
  }

  static async delete(productId: string, userId: string): Promise<void> {
    await prisma.product.delete({
      where: {
        id: productId,
        user_id: userId,
      },
    })
  }

  static async search(userId: string, filters: any) {
    return await prisma.product.findMany({
      where: {
        user_id: userId,
        AND: filters,
      },
      orderBy: {
        created_at: "desc",
      },
    })
  }

  static async getCategories(userId: string) {
    return await prisma.product.findMany({
      where: {
        user_id: userId,
      },
      select: {
        category: true,
      },
      distinct: [`category`],
    })
  }
}
