import prisma from "@/lib/prisma"
import { CreateSalesRecordRequest } from "@/types/sales-record"

export class SalesRecordServicesAPI {
  static async createMany(response: CreateSalesRecordRequest[]) {
    await prisma.salesRecord.createMany({
      data: response,
    })
  }

  static async create(response: CreateSalesRecordRequest) {
    await prisma.salesRecord.create({
      data: response,
    })
  }

  static async get(userId: string, orderBy: {}, filters: [] | any) {
    const records = await prisma.salesRecord.findMany({
      where: {
        user_id: userId,
        AND: filters,
      },
      orderBy: orderBy || { created_at: "desc" },
    })

    const totalRecords = await prisma.salesRecord.count({
      where: {
        user_id: userId,
        AND: filters,
      },
    })

    const [salesRecords, totalSalesRecords] = await Promise.all([records, totalRecords])

    return { salesRecords, totalSalesRecords }
  }

  static async getPagination(userId: string, skip: number, limit: number, orderBy: {}) {
    const records = await prisma.salesRecord.findMany({
      where: {
        user_id: userId,
      },
      orderBy: orderBy || { created_at: "desc" },
      skip: skip,
      take: limit,
    })

    const totalRecords = await prisma.salesRecord.count({
      where: {
        user_id: userId,
      },
    })

    const [salesRecords, totalSalesRecords] = await Promise.all([records, totalRecords])

    return { salesRecords, totalSalesRecords }
  }

  static async deleteAll(userId: string) {
    await prisma.salesRecord.deleteMany({
      where: {
        user_id: userId,
      },
    })
  }

  static async download(userId: string) {
    return await prisma.salesRecord.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    })
  }
}
