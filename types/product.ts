import { ProductSchema } from "@/schema"
import { Product, Unit } from "@prisma/client"
import { z } from "zod"

export type CreateProductRequest = {
  userId: string
  title: string
  description: string | null
  image: string
  price: number
  category: string
  stock: number
  unit?: Unit
  sku: string | null
}

export type ResponseDataType = Product

export interface ProductResponse {
  message: string
  data: ResponseDataType[]
  currentPage: number
  totalPages: number
  totalProductsPerPage: number
  totalProducts: number
}

export interface SearchResponse {
  message: string
  data: ResponseDataType[]
}

export interface InferProductSchemaType extends z.infer<typeof ProductSchema.CREATE> {}
