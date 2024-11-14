import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { Container } from "@/components/layout/container"
import ListsProducts, { LoadingListProducts } from "@/components/pages/dashboard/lists-products"
import { FallbackFilterButton, FilterProducts } from "@/components/pages/dashboard/filter-products"
import { SalesRecordView } from "@/components/pages/dashboard/sales-record-view"
import { SectionHeader, SectionContent } from "@/components/section"
import { MainContainer } from "@/components/layout/main-container"

const DashboardPage = async () => {
  const { userId, getToken } = auth()
  const token = await getToken()

  const actionButtonProduct = (
    <Suspense fallback={<FallbackFilterButton />}>
      <FilterProducts />
    </Suspense>
  )

  return (
    <MainContainer>
      <Container className="py-20">
        <SectionContent>
          <SectionHeader actionButton={actionButtonProduct}>produk kamu</SectionHeader>
          <Suspense fallback={<LoadingListProducts type="fallback" />}>
            <ListsProducts userId={userId!} token={token!} />
          </Suspense>
        </SectionContent>
      </Container>
      <SalesRecordView token={token!} /> {/* checkout button ~ absolute position */}
    </MainContainer>
  )
}

export default DashboardPage
