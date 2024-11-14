"use client"

import { InferProductType, ProductValidation } from "@/schema/product.schema"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import { ProductForm } from "./product-form"
import { TokenProps } from "@/types"

interface FormCreateProductProps extends TokenProps {
  userId: string
}

export const FormCreateProduct: React.FC<FormCreateProductProps> = ({ userId, token }) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<InferProductType>({
    resolver: zodResolver(ProductValidation.CREATE),
    defaultValues: {
      userId: userId!,
      title: "",
      description: "",
      image: "",
      price: 0,
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
    mutationFn: async (data: InferProductType) => {
      await axios.post("/api/products", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    },
    onSuccess: () => {
      form.reset({
        userId: userId!,
        title: "",
        description: "",
        image: "",
        price: 0,
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

  const onSubmit = (data: InferProductType) => {
    createProduct(data)
  }

  const previewProduct = {
    id: uuidv4(),
    userId: userId!,
    title: form.watch("title"),
    image: form.watch("image"),
    description: form.watch("description") ?? "",
    sku: form.watch("sku") ?? "",
    price: form.watch("price"),
    category: form.watch("category"),
    stock: form.watch("stock"),
    unit: form.watch("unit")!,
    createdAt: new Date(),
    updatedAt: new Date(),
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
