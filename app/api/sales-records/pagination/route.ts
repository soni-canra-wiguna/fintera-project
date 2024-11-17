import { NextRequest, NextResponse } from "next/server"
import { getQueryParams } from "@/utils/get-query-params"
import { AuthRequest } from "@/lib/auth-request"
import { errorResponse } from "@/lib/error-utils"
import { SalesRecordServicesAPI } from "@/utils/api/sales-record"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const userId = req.headers.get("userId") ?? ""
    const authError = await AuthRequest.token(req)

    if (authError) return authError

    const { page, limit, skip, orderBySalesRecord: orderBy } = getQueryParams(req)

    const { salesRecords, totalSalesRecords } = await SalesRecordServicesAPI.getPagination(
      userId,
      skip,
      limit,
      orderBy,
    )

    if (!totalSalesRecords || salesRecords.length === 0) {
      return NextResponse.json({ message: "data not found", data: [] }, { status: 200 })
    }

    const response = {
      message: "records successfully retrieved",
      data: salesRecords,
      currentPage: page,
      totalPages: Math.ceil(totalSalesRecords / limit),
      totalSalesRecordsPerPage: salesRecords.length,
      totalSalesRecords,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.log("[ERROR GET SALES RECORDS PAGINATION] : ", error)
    return errorResponse("Internal server error", 500)
  }
}
