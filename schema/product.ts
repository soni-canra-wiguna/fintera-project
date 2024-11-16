import { Unit } from "@prisma/client"
import * as z from "zod"

export class ProductSchema {
  static readonly CREATE = z.object({
    userId: z.string().min(1, {
      message: "userId is required",
    }),
    image: z.string().min(1, {
      message: "image product is required",
    }),
    title: z.string().min(1, {
      message: "title product is required",
    }),
    description: z.string().optional(),
    price: z.coerce.number().positive(),
    category: z
      .string()
      .min(1, {
        message: "category product is required",
      })
      .transform((val) => val.toLowerCase()),
    stock: z.coerce.number().nonnegative(),
    unit: z.nativeEnum(Unit).optional(),
    sku: z.string().max(50).optional(),
  })

  static readonly UPDATE = z.object({
    userId: z.string().optional(),
    image: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    category: z
      .string()
      .transform((val) => val.toLowerCase())
      .optional(),
    stock: z.coerce.number().nonnegative(),
    unit: z.nativeEnum(Unit).optional(),
    sku: z.string().max(50).optional(),
  })
}
