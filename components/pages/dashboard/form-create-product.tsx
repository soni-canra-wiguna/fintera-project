"use client"

import { ProductSchema } from "@/schema"
import { InferProductSchemaType } from "@/types/product"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import { ProductForm } from "./product-form"
import { TokenProps } from "@/types"
import { ProductServices } from "@/services"

interface FormCreateProductProps extends TokenProps {
  userId: string
}

export const FormCreateProduct: React.FC<FormCreateProductProps> = ({ userId, token }) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<InferProductSchemaType>({
    resolver: zodResolver(ProductSchema.CREATE),
    defaultValues: {
      user_id: userId!,
      title: "",
      description: "",
      image: "",
      price_purchase: 0,
      price_sale: 0,
      category: "",
      stock: 0,
      unit: "PCS",
      sku: "",
    },
  })

  const {
    isPending,
    mutate: createProduct,
    isError,
  } = useMutation({
    mutationFn: async (data: InferProductSchemaType) => {
      await ProductServices.create({ userId: userId!, token, data })
    },
    onSuccess: () => {
      form.reset({
        user_id: userId!,
        title: "",
        description: "",
        image: "",
        price_purchase: 0,
        price_sale: 0,
        category: "",
        stock: 0,
        unit: "PCS",
        sku: "",
      })
      toast({
        title: "Produk di buat",
        description: "Produk berhasil di buat",
      })
      router.push("/dashboard")
      queryClient.invalidateQueries({ queryKey: ["lists_products"] })
    },
    onError: () => {
      toast({
        title: "Gagal menambahkan produk",
        description: "Gagal menambahkan produk, pastikan koneksimu lancar",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: InferProductSchemaType) => {
    createProduct(data)
  }

  const previewProduct = {
    id: uuidv4(),
    user_id: userId,
    title: form.watch("title") ?? "",
    image: form.watch("image") ?? "",
    description: form.watch("description") ?? "",
    sku: form.watch("sku") ?? "",
    price_purchase: form.watch("price_purchase") ?? 0,
    price_sale: form.watch("price_sale") ?? 0,
    category: form.watch("category") ?? "PCS",
    stock: form.watch("stock"),
    unit: form.watch("unit")!,
    created_at: new Date(),
    updated_at: new Date(),
  }

  return (
    <ProductForm
      form={form}
      previewProduct={previewProduct}
      isPending={isPending}
      onSubmit={onSubmit}
      label="create"
    />
  )
}
