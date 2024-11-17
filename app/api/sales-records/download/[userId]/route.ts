import { NextRequest, NextResponse } from "next/server"
import { format } from "date-fns"
import { getSearchParams } from "@/utils/get-search-params"
import ExcelJS from "exceljs"
import { Buffer } from "buffer"
import { errorResponse } from "@/lib/error-utils"
import { SalesRecordServicesAPI } from "@/utils/api/sales-record"

export const dynamic = "force-dynamic"

export type FileType = "xlsx" | "csv"

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const { userId } = params
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized. User not Found." }, { status: 404 })
    }

    const fileType: "xlsx" | "csv" = (getSearchParams(req, "fileType") as FileType) ?? "csv"

    const salesRecord = await SalesRecordServicesAPI.download(userId)

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Riwayat Penjualan")

    worksheet.columns = [
      { header: "No", key: "no" },
      { header: "SKU Produk", key: "sku" },
      { header: "Nama Produk", key: "title" },
      { header: "Kategori", key: "category" },
      { header: "Gambar", key: "image" },
      { header: "Harga Beli", key: "price_purchase" },
      { header: "Harga Jual", key: "price_sale" },
      { header: "QTY", key: "quantity" },
      { header: "Harga Jual", key: "total_price" },
      { header: "Tipe Transaksi", key: "transaction_type" },
      { header: "Produt Id", key: "product_id" },
      { header: "User Id", key: "user_id" },
      { header: "Tanggal Pembelian", key: "created_at" },
    ]

    salesRecord.forEach(
      (
        {
          sku,
          title,
          category,
          image,
          price_purchase,
          price_sale,
          quantity,
          total_price,
          transaction_type,
          product_id,
          user_id,
          created_at,
        },
        index,
      ) => {
        worksheet.addRow({
          no: index + 1,
          sku,
          title,
          category,
          image: fileType === "xlsx" ? { text: image, hyperlink: image } : image,
          price_purchase,
          price_sale,
          quantity,
          total_price,
          transaction_type,
          product_id,
          user_id,
          created_at: format(created_at, "dd-MM-yyyy"),
        })
      },
    )

    let buffer: Buffer
    let contentType: string
    let fileName: string

    if (fileType === "csv") {
      buffer = Buffer.from(
        await workbook.csv.writeBuffer({
          formatterOptions: {
            delimiter: ";",
          },
        }),
      )
      contentType = "text/csv"
      fileName = "catatanPenjualan.csv"
    } else {
      buffer = Buffer.from(await workbook.xlsx.writeBuffer())
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      fileName = "catatanPenjualan.xlsx"
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename=${fileName}`,
      },
    })
  } catch (error) {
    console.log("[ERROR GET DOWNLOAD SALES RECORDS] : ", error)
    return errorResponse("Internal server error", 500)
  }
}
