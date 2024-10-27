"use client"

import { Tag, TicketPercent, ArrowLeft, X } from "lucide-react"
import { Button } from "../ui/button"
import { HTMLAttributes, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog"
import { discountProduct } from "@/redux/features/product/product-slice"
import { Slider } from "../ui/slider"
import { useDispatch } from "react-redux"
import { formatToIDR } from "@/utils/format-to-idr"
import { Input } from "../ui/input"

type DiscountProps = "percent" | "nominal" | null

interface ContentWrapperProps extends HTMLAttributes<HTMLDivElement> {
  id: string
  setIsOpen: (isOpen: boolean) => void
  action: () => void
  backAction: () => void
}

export const DiscountProduct: React.FC<{ id: string; price: number }> = ({ id, price }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [discountPercent, setDiscountPercent] = useState<number[]>([0])
  const [discountNominal, setDiscountNominal] = useState(0)
  const [discountType, setDiscountType] = useState<DiscountProps>(null)
  const dispatch = useDispatch()

  function handleActionToAppliedPercent() {
    const discount = (price * discountPercent[0]) / 100
    dispatch(discountProduct({ id, discount }))
    setIsOpen(false)
    setDiscountNominal(0)
  }

  function handleActionToAppliedNominal() {
    const discount = discountNominal
    dispatch(discountProduct({ id, discount }))
    setIsOpen(false)
    setDiscountPercent([0])
  }

  function backAction() {
    setDiscountType(null)
    setDiscountPercent([0])
    setDiscountNominal(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <p className="text-xs font-medium text-main">
          Diskon :{" "}
          {discountType === null
            ? 0
            : discountType === "percent"
              ? `${discountPercent[0]}%`
              : formatToIDR(discountNominal)}
        </p>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] rounded-xl p-4 sm:max-w-md">
        <DialogHeader className="hidden">
          <DialogTitle>nothing</DialogTitle>
          <DialogDescription>nothing</DialogDescription>
        </DialogHeader>
        {discountType === null ? (
          <>
            <div
              onClick={() => setDiscountType("nominal")}
              className="gradientCard flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-4"
            >
              <Tag className="size-8 stroke-[1.5]" />
              <span className="font-medium capitalize">nominal</span>
            </div>
            <div
              onClick={() => setDiscountType("percent")}
              className="gradientCard flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-4"
            >
              <TicketPercent className="size-8 stroke-[1.5]" />
              <span className="font-medium capitalize">persen</span>
            </div>
          </>
        ) : discountType === "percent" ? (
          <ContentWrapper
            id={id}
            action={handleActionToAppliedPercent}
            backAction={backAction}
            setIsOpen={setIsOpen}
          >
            <div className="flex flex-col gap-4 py-2">
              <h3 className="text-base font-medium">Diskon: {discountPercent} %</h3>
              <Slider
                value={discountPercent}
                defaultValue={[0]}
                max={100}
                step={1}
                onValueChange={(value) => setDiscountPercent(value)}
              />
            </div>
          </ContentWrapper>
        ) : (
          <ContentWrapper
            id={id}
            action={handleActionToAppliedNominal}
            backAction={backAction}
            setIsOpen={setIsOpen}
          >
            <div className="flex flex-col gap-4 py-2">
              <h3 className="text-base font-medium">Diskon: {formatToIDR(discountNominal)}</h3>
              <Input
                placeholder="masukkan nominal diskon. Ex: 2000"
                value={discountNominal}
                onChange={(e) => setDiscountNominal(Number(e.target.value))}
                type="number"
              />
            </div>
          </ContentWrapper>
        )}
      </DialogContent>
    </Dialog>
  )
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({
  id,
  children,
  setIsOpen,
  action,
  backAction,
}) => {
  const dispatch = useDispatch()

  return (
    <>
      <DialogHeader className="flex flex-row items-center justify-between border-b">
        <Button
          onClick={() => {
            backAction()
            dispatch(discountProduct({ id, discount: 0 }))
          }}
          className="flex h-10 w-max items-center gap-3 px-3"
          variant="ghost"
        >
          <ArrowLeft className="size-4 stroke-[1.5]" />
          <h3 className="font-medium capitalize">kembali</h3>
        </Button>
        <DialogClose asChild>
          <Button variant="ghost" size="icon" onClick={backAction}>
            <X className="size-6 stroke-[1.5]" />
            <p className="sr-only">close</p>
          </Button>
        </DialogClose>
      </DialogHeader>
      {children}
      <DialogFooter className="flex-row justify-end gap-2.5">
        <DialogClose asChild>
          <Button
            onClick={() => {
              backAction()
              setIsOpen(false)
              dispatch(discountProduct({ id, discount: 0 }))
            }}
            className="capitalize"
            variant="outline"
          >
            batal
          </Button>
        </DialogClose>
        <Button onClick={action} className="capitalize">
          Terapkan
        </Button>
      </DialogFooter>
    </>
  )
}
