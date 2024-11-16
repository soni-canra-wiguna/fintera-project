import { SalesRecord, TransactionType } from "@prisma/client"
import * as z from "zod"

export class SalesRecordSchema {
  static readonly CREATE = z.object({
    user_id: z.string(),
    title: z.string(),
    category: z.string(),
    image: z.string(),
    sku: z.string().max(50).optional(),
    quantity: z.coerce.number().positive(),
    price_purchase: z.coerce.number().positive(),
    price_sale: z.coerce.number().positive(),
    total_price: z.coerce.number().positive(),
    transaction_type: z.enum([TransactionType.SALE, TransactionType.EXPENSE]),
    product_id: z.string(),
  })

  static readonly ARRAY_CREATE = z.array(
    z.object({
      user_id: z.string(),
      title: z.string(),
      category: z.string(),
      image: z.string(),
      sku: z.string().max(50).optional(),
      quantity: z.coerce.number().positive(),
      price_purchase: z.coerce.number().positive(),
      price_sale: z.coerce.number().positive(),
      total_price: z.coerce.number().positive(),
      transaction_type: z.enum([TransactionType.SALE, TransactionType.EXPENSE]),
      product_id: z.string(),
    }),
  )
}
