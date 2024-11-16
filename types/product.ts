import { ProductSchema } from "@/schema"
import { Product, Unit } from "@prisma/client"
import { z } from "zod"

export type CreateProductRequest = Omit<Product, "id" | "created_at" | "updated_at">

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
