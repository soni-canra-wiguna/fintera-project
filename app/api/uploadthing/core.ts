import prisma from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { handleCsvFile } from "@/utils/handle-csv-file"
import { auth } from "@clerk/nextjs/server"
import { Ratelimit } from "@upstash/ratelimit"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 m"),
  analytics: true,
  enableProtection: true,
  timeout: 5000,
})

export const ourFileRouter = {
  product: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const user = auth()
      if (!user || !user.userId) throw new Error("Unauthorized")

      const ip = req.ip ?? user.userId
      const { success, limit, remaining, reset } = await rateLimit.limit(ip)

      if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000)
        throw new Error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`)
      }

      return { userId: user.userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url)
    }),

  productsCsv: f({
    "text/csv": {
      maxFileSize: "8MB",
      maxFileCount: 1,
      minFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = auth()
      if (!user || !user.userId) throw new Error("Unauthorized")

      const ip = req.ip ?? user.userId
      const { success, limit, remaining, reset } = await rateLimit.limit(ip)

      if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000)
        throw new Error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`)
      }

      return { userId: user.userId }
    })
    .onUploadError(({ error }) => {
      console.log("[ON UPLOAD ERROR] : ", error)
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const records = await handleCsvFile(file.url)
        if (!records) return

        console.log(records)
        await prisma.product.createMany({
          data: records.map((record) => ({
            user_id: metadata.userId,
            title: record.title,
            description: record.description,
            image: record.image,
            price_purchase: +record.price_purchase,
            price_sale: +record.price_sale,
            category: record.category,
            stock: +record.stock,
            unit: record.unit ?? "PCS",
            sku: record.sku,
          })),
          skipDuplicates: true,
        })
      } catch (error) {
        console.log("[ERROR INSERT PRODUCT] : ", error)
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
