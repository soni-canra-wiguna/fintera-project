import { auth } from "@clerk/nextjs/server"
import { Container } from "@/components/layout/container"
import { MainContainer } from "@/components/layout/main-container"
import { CreateProductTabs } from "@/components/pages/dashboard/create-product-tabs"

const CreateProductPage = async () => {
  const { userId, getToken } = auth()
  const token = await getToken()
  return (
    <MainContainer>
      <Container className="py-20">
        <CreateProductTabs userId={userId ?? ""} token={token ?? ""} />
      </Container>
    </MainContainer>
  )
}

export default CreateProductPage
