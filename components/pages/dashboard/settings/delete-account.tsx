"use client"

import { LoadingButton } from "@/components/loading-button"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { TriangleAlert } from "lucide-react"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import { DeleteModal } from "@/components/delete-modal"
import { TokenProps } from "@/types"

export interface DeleteAccountProps extends TokenProps {
  userId: string
}

export const DeteleAccount: React.FC<DeleteAccountProps> = ({ userId, token }) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { signOut } = useClerk()

  const {
    mutate: deleteAccount,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId,
        },
      })

      await signOut()
    },
    onSuccess: () => {
      toast({
        description: "akun telah di hapus",
      })
      setIsOpen(false)
      router.push("/")
    },
    onError: () => {
      toast({
        description: "something went wrong, try again!!",
      })
    },
  })

  const trigger = (
    <Button
      className="border border-destructive bg-destructive/20 capitalize text-destructive hover:bg-destructive/25"
      variant="destructive"
    >
      <TriangleAlert className="mr-2 size-4" /> Hapus Akun
    </Button>
  )

  const action = (
    <LoadingButton
      onClick={() => deleteAccount()}
      disabled={isPending}
      loading={isPending}
      className="capitalize"
      variant="destructive"
    >
      ya, hapus akun
    </LoadingButton>
  )

  return (
    <DeleteModal
      title="Hapus akun"
      description="Aksi ini akan menghapus akun kamu, termasuk produk dan catatan yang
      telah kamu buat. Apa kamu yakin ingin menghapusnya"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger={trigger}
      action={action}
    />
  )
}
