import { Product, Unit } from "@prisma/client"
import * as z from "zod"

export class ProductSchema {
  static readonly CREATE = z.object({
    title: z.string().min(1, { message: "title product is required" }),
    description: z.string().optional(),
    image: z.string().optional(),
    price_purchase: z.coerce.number().positive(),
    price_sale: z.coerce.number().positive(),
    category: z
      .string()
      .min(1, {
        message: "category product is required",
      })
      .transform((val) => val.toLowerCase()),
    stock: z.coerce.number().nonnegative(),
    sku: z.string().max(50).optional(),
    unit: z.nativeEnum(Unit).optional(),
    user_id: z.string().min(1, { message: "userId is required" }),
  })

  static readonly UPDATE = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    price_purchase: z.coerce.number().positive().optional(),
    price_sale: z.coerce.number().positive().optional(),
    category: z
      .string()
      .transform((val) => val.toLowerCase())
      .optional(),
    stock: z.coerce.number().nonnegative(),
    sku: z.string().max(50).optional(),
    unit: z.nativeEnum(Unit).optional(),
    user_id: z.string().optional(),
  })
}
