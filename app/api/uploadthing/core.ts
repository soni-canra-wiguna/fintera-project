import prisma from "@/lib/prisma"
import { handleCsvFile } from "@/utils/handle-csv-file"
import { auth } from "@clerk/nextjs/server"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  product: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = auth()
      if (!user || !user.userId) throw new Error("Unauthorized")
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
    .middleware(async () => {
      const user = auth()
      if (!user || !user.userId) throw new Error("Unauthorized")
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
