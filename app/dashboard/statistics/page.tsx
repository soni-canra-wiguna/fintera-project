import React, { Suspense } from "react"
import { FilterButton, FilterStatistic } from "@/components/dashboard/statistic/filter"
import SummaryOfTotalRevenue, {
  LoadingSummaryOfTotalRevenue,
} from "@/components/dashboard/statistic/summary-of-total-revenue"
import { Wrapper } from "@/components/layout/wrapper"
import TableRecords from "@/components/dashboard/statistic/table-records"
import { SectionHeader, SectionContent } from "@/components/section"
import { DownloadTransactionHistory } from "@/components/dashboard/statistic/download-transaction-history"
import { MainContainer } from "@/components/layout/main-container"
import { auth } from "@clerk/nextjs/server"

const StatisticsPage = async () => {
  const { userId, getToken } = auth()
  const token = await getToken()

  const actionButtonStatistic = (
    <Suspense fallback={<FilterButton />}>
      <FilterStatistic />
    </Suspense>
  )

  return (
    <MainContainer>
      <Wrapper className="py-20">
        <SectionContent>
          <SectionHeader actionButton={actionButtonStatistic}>statistik penjualan</SectionHeader>
          <Suspense fallback={<LoadingSummaryOfTotalRevenue />}>
            <SummaryOfTotalRevenue token={token ?? ""} userId={userId ?? ""} />
          </Suspense>
        </SectionContent>
        <SectionContent>
          <SectionHeader actionButton={<DownloadTransactionHistory />}>
            riwayat transaksi
          </SectionHeader>
          <TableRecords token={token ?? ""} userId={userId ?? ""} />
        </SectionContent>
      </Wrapper>
    </MainContainer>
  )
}

export default StatisticsPage
