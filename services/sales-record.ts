import axios from "axios"
import { DataProps, WithTokenAndUserId } from "@/types"
import {
  CreateSalesRecordRequest,
  SalesRecordsPaginationResponse,
  SalesRecordsResponse,
} from "@/types/sales-record"

interface salesRecordsServicesProps extends WithTokenAndUserId {
  from: string
  to: string
}

interface SalesRecordsPaginationServicesProps extends WithTokenAndUserId {
  sortBy: string
  page: number
  limit: string
}

interface CreateSalesRecords extends WithTokenAndUserId, DataProps<CreateSalesRecordRequest[]> {}

export class SalesRecordServices {
  static async salesRecords({
    from,
    to,
    token,
    userId,
  }: salesRecordsServicesProps): Promise<SalesRecordsResponse> {
    const { data }: { data: SalesRecordsResponse } = await axios.get(
      `/api/sales-records?from=${from}&to=${to}`,
      {
        headers: {
          Authorization: token,
          userId,
        },
      },
    )
    return data
  }

  static async salesRecordsPagination({
    sortBy,
    page,
    limit,
    token,
    userId,
  }: SalesRecordsPaginationServicesProps): Promise<SalesRecordsPaginationResponse> {
    const { data } = await axios.get(
      `/api/sales-records/pagination?sortBy=${sortBy}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: token,
          userId: userId,
        },
      },
    )
    return data
  }

  static async createSalesRecords({ token, userId, data }: CreateSalesRecords) {
    await axios.post(`/api/sales-records`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        userId: userId!,
      },
    })
  }
}
