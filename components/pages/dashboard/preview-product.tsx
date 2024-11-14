"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { X } from "lucide-react"
import { WithChildren } from "@/types"
import { ResponseDataType } from "@/types/product"
import { formatToIDR } from "@/utils/format-to-idr"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Balancer } from "react-wrap-balancer"
import parse from "html-react-parser"
import React from "react"

interface PreviewDetailProductProps extends WithChildren {
  product: ResponseDataType
  setIsOpen?: (isOpen: boolean) => void
}

interface WrapperDetailProductProps extends WithChildren {
  title: string
  className?: string
}

const WithTypographyStyle: React.FC<{
  className?: string
  children: React.ReactNode
}> = ({ className, children }) => {
  return (
    <div
      className={cn("no-before no-after prose prose-p:text-sm prose-p:text-foreground", className)}
    >
      {children}
    </div>
  )
}

const WrapperDetailProduct: React.FC<WrapperDetailProductProps> = ({
  children,
  title,
  className,
}) => {
  return (
    <div className={cn("flex w-full items-start px-3 py-3 text-sm", className)}>
      <div className="w-16">
        <h5 className="text-balance font-semibold capitalize">{title}</h5>
      </div>
      <span className="mx-2">:</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export const PreviewDetailProduct: React.FC<PreviewDetailProductProps> = ({
  product,
  children,
  setIsOpen,
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="mobileDrawer">
        <DrawerHeader className="flex items-center justify-between border-b">
          <DrawerTitle className="sr-only">detail produk</DrawerTitle>
          <DrawerDescription className="sr-only">detail produk {product.title}</DrawerDescription>
          <div className="flex items-center gap-3">
            <h3 className="font-semibold capitalize">Detail produk</h3>
          </div>
          <DrawerClose asChild>
            <Button onClick={() => setIsOpen?.(false)} className="" variant="ghost" size="icon">
              <X className="size-6 stroke-[1.5]" />
              <p className="sr-only">close</p>
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="scrollbar-hide h-full max-h-[450px] w-full overflow-y-auto p-4">
          <div className="mb-5 aspect-[14/9] w-full overflow-hidden rounded-xl">
            <img src={product.image} alt={product.title} className="size-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-xl border">
            <WrapperDetailProduct title="title">
              <Balancer className="">{product.title}</Balancer>
            </WrapperDetailProduct>
            <WrapperDetailProduct className="bg-secondary" title="harga">
              <p className="">{formatToIDR(product.price)}</p>
            </WrapperDetailProduct>
            <WrapperDetailProduct title="kategori">
              <Badge variant="secondary" className="capitalize">
                {product.category}
              </Badge>
            </WrapperDetailProduct>
            <WrapperDetailProduct className="bg-secondary" title="sku">
              <p>{product.sku}</p>
            </WrapperDetailProduct>
            <WrapperDetailProduct title="stock">
              <p className="">{`${product.stock} ${product.unit}`}</p>
            </WrapperDetailProduct>
            <WrapperDetailProduct className="bg-secondary" title="deskripsi">
              <WithTypographyStyle>{parse(product.description!)}</WithTypographyStyle>
            </WrapperDetailProduct>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
