import React from "react"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { Container } from "@/components/layout/container"
import { MainContainer } from "@/components/layout/main-container"
import { FormEditProduct } from "@/components/pages/dashboard/form-edit-product"

const EditProductPage: React.FC<{ params: { id: string } }> = async ({ params }) => {
  const { userId, getToken } = auth()
  const token = await getToken()

  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
      user_id: userId!,
    },
  })

  if (!product) {
    return <div>Produk tidak di temukan :/ </div>
  }

  return (
    <MainContainer>
      <Container className="pb-20 pt-16">
        <FormEditProduct product={product} token={token ?? ""} />
      </Container>
    </MainContainer>
  )
}

export default EditProductPage
