"use client"

import { ShoppingBagIcon, Minus, LayoutGrid, Columns2, AlignJustify, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useState } from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import {
  decrementProduct,
  incermentProduct,
  ProductSliceType,
  removeProduct,
  resetProduct,
} from "@/redux/features/product/product-slice"
import { formatToIDR } from "@/utils/format-to-idr"
import { useMounted } from "@/hook/use-mounted"
import { toast } from "@/components/ui/use-toast"
import { LoadingButton } from "@/components/loading-button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"
import { CreateSalesRecordRequest } from "@/types/sales-record"
import { DeleteModal } from "@/components/delete-modal"
import { TokenProps } from "@/types"
import { DiscountProduct } from "./discount-product"

interface LayoutSwitcherProps {
  disabledButton: boolean
  layoutSwitcher: "list" | "slider"
  setLayoutSwitcher: (layoutSwitcher: "list" | "slider") => void
}

interface ResetListsProductsButtonProps {
  disabledButton: boolean
  closeDrawer: () => void
}

type AddProductToRecordProps = ResetListsProductsButtonProps & TokenProps

export const SalesRecordView: React.FC<TokenProps> = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [layoutSwitcher, setLayoutSwitcher] = useState<"list" | "slider">("list")

  const { products } = useSelector((state: RootState) => state.products)
  const totalProducts = products.length
  const totalPrice = products.reduce((acc, product) => {
    return acc + product.price_sale
  }, 0)
  const disabledButton: boolean = totalProducts <= 0

  const SaleRecordsButton = ({ totalProducts = 0 }: { totalProducts: number }) => {
    return (
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-[70px] right-4 z-30 flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary",
          totalProducts <= 0 ? "hidden" : "flex",
        )}
      >
        <div className="relative">
          <ShoppingBagIcon className="size-7 stroke-[1.5] text-background" />
          <span className="absolute -bottom-1 -right-1.5 flex size-4 items-center justify-center rounded-full border-white bg-red-500 p-2 text-sm text-background selection:bg-transparent">
            {totalProducts}
          </span>
        </div>
      </div>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <SaleRecordsButton totalProducts={totalProducts} />
      <DrawerContent className="mobileDrawer">
        <DrawerHeader className="flex items-center justify-between border-b">
          <DrawerTitle className="sr-only">jumlah produk</DrawerTitle>
          <DrawerDescription className="sr-only">
            jumlah produk di keranjang yaitu {totalProducts}
          </DrawerDescription>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold capitalize">Jumlah Produk</h3>
            <p className="font-medium">{totalProducts}</p>
          </div>
          <div className="flex items-center gap-2">
            <LayoutSwitcher
              disabledButton={disabledButton}
              layoutSwitcher={layoutSwitcher}
              setLayoutSwitcher={setLayoutSwitcher}
            />
            <DrawerClose asChild>
              <Button className="" variant="ghost" size="icon">
                <X className="size-6 stroke-[1.5]" />
                <p className="sr-only">close</p>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="scrollbar-hide h-full max-h-[400px] w-full overflow-y-auto p-4">
          {layoutSwitcher === "list" ? (
            <div className="flex h-full flex-col gap-4">
              {products.map((product) => (
                <CardDrawer key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Carousel
              opts={{
                loop: true,
                align: "start",
              }}
            >
              <CarouselContent>
                {products.map((product) => (
                  <CarouselItem key={product.id}>
                    <CardDrawer product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>
        <DrawerFooter className="border-t">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium">Total Harga : </p>
              <p className="text-sm font-semibold">{formatToIDR(totalPrice)}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <ResetListsProductsButton
                disabledButton={disabledButton}
                closeDrawer={() => setIsOpen(!isOpen)}
              />
              <AddProductToRecord
                token={token}
                closeDrawer={() => setIsOpen(!isOpen)}
                disabledButton={disabledButton}
              />
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const CardDrawer: React.FC<{ product: ProductSliceType }> = ({ product }) => {
  const dispatch = useDispatch()

  const DeleteButton = ({ id }: { id: string }) => {
    return (
      <span
        onClick={() => {
          dispatch(removeProduct(id))
          toast({
            title: "produk di hapus",
            variant: "destructive",
          })
        }}
        className="absolute left-0 top-0 flex cursor-pointer items-center justify-center rounded-lg bg-destructive p-1.5"
      >
        <X className="size-3 text-background" />
      </span>
    )
  }
  return (
    <Card className="relative flex h-28 items-start justify-between rounded-xl p-1.5">
      <DeleteButton id={product.id} />
      <div className="flex w-full items-start gap-2">
        <div className="aspect-square h-20 overflow-hidden rounded-xl">
          <img alt="image" src={product.image ?? ""} className="size-full object-cover" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold capitalize">{product.title}</h4>
          <p className="flex items-center gap-2 text-xs font-medium">
            {formatToIDR(product.unit_price)}
            <span className="text-xs text-main">x {product.quantity}</span>
          </p>
          <p className="text-xs">
            stock: {product.stock} {product.unit}
          </p>
          {/* <DiscountProduct id={product.id} price={product.price} /> */}
          <p className="text-xs font-medium">Total Harga: {formatToIDR(product.price_sale)}</p>
        </div>
      </div>
      <div className="flex h-full flex-col justify-between gap-2">
        <Button
          onClick={() => {
            dispatch(decrementProduct(product))
          }}
          disabled={product.quantity <= 1}
          className="size-8 rounded-lg"
          size="icon"
          variant="outline"
        >
          <Minus className="size-4 stroke-[1.5]" />
        </Button>
        <span className="text-center text-sm">{product.quantity}</span>
        <Button
          onClick={() => {
            dispatch(incermentProduct(product))
          }}
          disabled={product.quantity === product.stock}
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

const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({
  disabledButton,
  layoutSwitcher,
  setLayoutSwitcher,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  function ButtonSwitcher(item: { type: "list" | "slider"; icon: any }) {
    const handleSwitch = () => {
      setLayoutSwitcher(item.type)
      setIsOpen(!isOpen)
    }

    return (
      <div
        onClick={handleSwitch}
        className={cn(
          "group relative flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm capitalize hover:bg-main/10",
          layoutSwitcher === item.type && "bg-main/10",
        )}
      >
        <span
          className={cn(
            "absolute left-0 top-1/2 hidden h-6 w-1 -translate-y-1/2 rounded-lg bg-main group-hover:inline",
            layoutSwitcher === item.type && "inline",
          )}
        />
        <item.icon className="size-4 stroke-[1.5]" />
        {item.type}
      </div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" disabled={disabledButton}>
          <LayoutGrid className="size-5 stroke-[1.5]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-40 flex-col">
        <ButtonSwitcher icon={AlignJustify} type="list" />
        <ButtonSwitcher icon={Columns2} type="slider" />
      </PopoverContent>
    </Popover>
  )
}

const ResetListsProductsButton: React.FC<{
  disabledButton: boolean
  closeDrawer: () => void
}> = ({ disabledButton, closeDrawer }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dispatch = useDispatch()

  const handleResetProduct = () => {
    dispatch(resetProduct())
    setIsOpen(!isOpen)
    closeDrawer()
    toast({
      title: "semua produk telah di hapus",
      variant: "destructive",
    })
  }

  const trigger = (
    <Button disabled={disabledButton} className="" variant="secondary" size="icon">
      <Trash className="size-5 stroke-[1.5]" />
      <p className="sr-only">reset produk</p>
    </Button>
  )

  const action = (
    <Button onClick={handleResetProduct} className="capitalize" variant="destructive">
      ya, hapus produk
    </Button>
  )

  return (
    <DeleteModal
      title="Hapus semua produk"
      description="Apakah kamu yakin ingin menghapus semua produk"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger={trigger}
      action={action}
    />
  )
}

const AddProductToRecord: React.FC<AddProductToRecordProps> = ({
  token,
  closeDrawer,
  disabledButton,
}) => {
  const { userId } = useAuth()
  const dispatch = useDispatch()
  const { isMounted } = useMounted()
  const queryClient = useQueryClient()
  const { products } = useSelector((state: RootState) => state.products)

  const {
    mutate: createRecords,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async (data: CreateSalesRecordRequest[]) => {
      await axios.post(`/api/sales-records`, data, {
        // tambah catatan
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId!,
        },
      })
    },
    onSuccess: async () => {
      // update stock product based on current stock - qunatity
      await Promise.all(
        products.map((product) =>
          axios.patch(
            `/api/products/${product.id}`,
            {
              stock: product.stock - product.quantity,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                userId: userId,
              },
            },
          ),
        ),
      )
      queryClient.invalidateQueries({ queryKey: ["lists_products"] })
      queryClient.invalidateQueries({ queryKey: ["pagging_salesrecord"] })
      queryClient.invalidateQueries({ queryKey: ["sales_records"] })
      dispatch(resetProduct())
      closeDrawer()
      toast({
        description: "catatan di tambahkan",
        variant: "success",
      })
    },
    onError: () => {
      toast({
        title: "gagal menambahkan catatan",
        description: "coba cek koneksi internet kamu",
        variant: "destructive",
      })
    },
  })

  const handleAddSalesRecord = () => {
    try {
      const records: CreateSalesRecordRequest[] = products.map((product) => ({
        user_id: product.user_id,
        title: product.title,
        image: product.image ?? "",
        category: product.category,
        price_purchase: product.price_purchase,
        price_sale: product.unit_price,
        total_price: product.price_sale,
        transaction_type: "SALE",
        quantity: product.quantity,
        sku: product.sku ?? "",
        product_id: product.id,
      }))

      createRecords(records)
    } catch (error) {
      console.log("[FAILED TO CREATE RECORD]", error)
    }
  }

  if (!isMounted) {
    return <Button className="capitalize">Tambahkan</Button>
  }

  if (isError) {
    toast({
      title: "gagal menambahkan catatan",
      description: "coba cek koneksi internet kamu",
      variant: "destructive",
    })
  }

  return (
    <LoadingButton
      onClick={handleAddSalesRecord}
      loading={isPending}
      disabled={isPending || disabledButton}
    >
      Tambahkan
    </LoadingButton>
  )
}
