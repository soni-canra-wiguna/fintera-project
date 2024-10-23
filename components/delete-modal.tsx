"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface DeleteModalProps {
  title: string
  titleProduct?: string
  description: string
  action: React.ReactNode
  trigger: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
  titleProduct,
  description,
  action,
  trigger,
  isOpen,
  setIsOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {" "}
            {description} {titleProduct && <span className="font-semibold">{titleProduct}</span>} ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2.5">
          <DialogClose asChild>
            <Button onClick={() => setIsOpen(false)} className="capitalize" variant="outline">
              batal
            </Button>
          </DialogClose>
          {action}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
