import { SalesRecordSchema } from "@/schema"
import { SalesRecord } from "@prisma/client"
import { z } from "zod"

export type CreateSalesRecordRequest = z.infer<typeof SalesRecordSchema.CREATE>

export type ResponseDataType = SalesRecord

export interface ProductResponse {
  message: string
  data: ResponseDataType[]
  currentPage: number
  totalPages: number
  totalProductsPerPage: number
  totalProducts: number
}

export interface SalesAndRevenueByCategoryResponse {
  label: string
  quantity: number
  total_price: number
}

export interface StatisticResponse {
  totalSales: number
  totalRevenue: number
  totalTransactions: number
  averageSalePerTransaction: number
  averageRevenuePerTransaction: number
  salesByCategory: Record<string, number>
  salesAndRevenueByCategory: SalesAndRevenueByCategoryResponse[]
  revenueByCategory: Record<string, number>
  salesByMonth: Record<string, number>
  revenueByMonth: Record<string, number>
  topSellingProducts: {
    product: string
    quantity: number
  }[]
}

export interface SalesRecordsResponse {
  message: string
  data: SalesRecord[]
  statistic: StatisticResponse
}

export interface SalesRecordsPaginationResponse {
  message: string
  data: SalesRecord[]
  currentPage: number
  totalPages: number
  totalSalesRecordsPerPage: number
  totalSalesRecords: number
}
