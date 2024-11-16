import { NextRequest } from "next/server"
import { getSearchParams } from "./get-search-params"
import { SearchByType } from "@/app/api/products/search/route"
import { OrderBy } from "./order-by"

export const getQueryParams = (req: NextRequest) => {
  const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1")
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20")
  const sortBy = req.nextUrl.searchParams.get("sortBy")
  const skip = (page - 1) * limit
  const query = getSearchParams(req, "query") ?? ""
  const searchBy = (getSearchParams(req, "searchBy") ?? "productName") as SearchByType
  const from = getSearchParams(req, "from") ?? "" // createdAt
  const to = getSearchParams(req, "to") ?? "" // createdAt
  const category = getSearchParams(req, "category") // category
  const orderBy = OrderBy.product(sortBy) as {}
  const orderBySalesRecord = OrderBy.salesRecord(sortBy) as {}

  return {
    page,
    limit,
    skip,
    orderBy,
    query,
    searchBy,
    from,
    to,
    category,
    sortBy,
    orderBySalesRecord,
  }
}
