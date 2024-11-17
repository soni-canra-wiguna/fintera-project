"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { MoreVertical, Plus, Pencil, FileSearch } from "lucide-react"
import { useDispatch } from "react-redux"
import { formatToIDR } from "@/utils/format-to-idr"
import { incermentProduct } from "@/redux/features/product/product-slice"
import { DeleteProduct } from "./delete-product"
import { PreviewDetailProduct } from "./preview-product"
import { TokenProps } from "@/types"
import { ResponseDataType } from "@/types/product"

interface ProductCardProps extends TokenProps {
  product: ResponseDataType
  userId: string
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, userId, token }) => {
  const dispacth = useDispatch()

  const dataProduct = {
    id: product.id,
    user_id: product.user_id,
    title: product.title,
    image: product.image,
    price_purchase: product.price_purchase,
    price_sale: product.price_sale,
    stock: product.stock,
    category: product.category,
    quantity: 1,
    unit: product.unit!,
    unit_price: product.price_sale,
    sku: product.sku,
  }

  const handleIncermentProduct = () => {
    dispacth(incermentProduct(dataProduct))
    toast({
      title: "produk berhasil ditambahkan",
      variant: "success",
    })
  }

  return (
    <Card
      className={cn(
        "flex h-24 items-start justify-between rounded-xl p-1.5",
        product.stock <= 0
          ? "border-red-500/50 bg-red-500/10"
          : product.stock <= 5 && "border-yellow-500/50 bg-yellow-500/10",
      )}
    >
      <div className="flex w-full items-start gap-2">
        <div className="aspect-square h-20 overflow-hidden rounded-xl border">
          <img alt="image" src={product.image ?? ""} className="size-full object-cover" />
        </div>
        <div className="">
          <h4 className="text-sm font-semibold capitalize">{product.title}</h4>
          <p className="text-xs">{formatToIDR(product.price_sale)}</p>
          <p className="text-xs">
            stock: {product.stock} {product.unit}
          </p>
        </div>
      </div>
      <div className="flex h-full flex-col justify-between gap-2">
        <MoreOptions product={product} userId={userId} token={token} />
        <Button
          onClick={handleIncermentProduct}
          disabled={product.stock <= 0}
          className="size-8 rounded-lg"
          size="icon"
          variant="outline"
        >
          <Plus className="size-4 stroke-[1.5]" />
        </Button>
      </div>
    </Card>
  )
}

const MoreOptions: React.FC<ProductCardProps> = ({ product, userId, token }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="size-8 rounded-lg" size="icon" variant="ghost">
          <MoreVertical className="size-4 stroke-[1.5]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-32 flex-col">
        <PreviewDetailProduct product={product} setIsOpen={setIsOpen}>
          <div
            className={cn(
              "relative flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm capitalize hover:bg-secondary",
            )}
          >
            <FileSearch className="size-4 stroke-[1.5]" />
            Detail
          </div>
        </PreviewDetailProduct>
        <Link
          href={`/dashboard/products/edit/${product.id}`}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm capitalize hover:bg-secondary",
          )}
        >
          <Pencil className="size-4 stroke-[1.5]" />
          edit
        </Link>
        <DeleteProduct
          setIsOpen={setIsOpen}
          userId={userId}
          token={token}
          id={product.id}
          title={product.title}
        />
      </PopoverContent>
    </Popover>
  )
}
