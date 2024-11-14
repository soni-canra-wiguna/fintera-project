"use client"

import React, { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { ArrowLeft, CopyIcon, Settings } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeSwitcher } from "@/components/theme-switcher"
import Link from "next/link"
import { WithTokenAndUserId } from "@/types"
import { toast } from "@/components/ui/use-toast"

export const UserProfile: React.FC<Pick<WithTokenAndUserId, "userId">> = ({ userId }) => {
  const { user, isLoaded } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const image = user?.externalAccounts[0].imageUrl
  const email = user?.externalAccounts[0].emailAddress
  const firstName = user?.externalAccounts[0].firstName
  const lastName = user?.externalAccounts[0].lastName
  const fullName = `${firstName!} ${lastName!}`

  function togglePopover() {
    setIsOpen(!isOpen)
  }

  function copyUserId() {
    navigator.clipboard.writeText(userId)
    toast({
      title: "userId telah di copy"
    })
  }

  if (!isLoaded) return <Skeleton variant="shimmer" className="size-9 rounded-full" />

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="size-9 cursor-pointer overflow-hidden rounded-full">
          <img src={image} alt={fullName} className="size-full object-cover" />
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="gradientCard relative flex w-72 flex-col gap-4 p-0">
        <UserSettings togglePopover={togglePopover} />
        <div className="flex flex-col gap-1 p-4">
          <h6 className="text-base font-semibold">{fullName}</h6>
          <p className="text-xs font-medium text-muted-foreground mb-1">{email}</p>
          <p
            onClick={copyUserId}
            className="flex items-center justify-center gap-2 rounded-md border py-1 px-2.5 text-xs w-max bg-main/10 border-main/30"
          >
            {userId.length > 25 ? `${userId?.slice(0, 25)}...` : userId}
            <CopyIcon className="size-3" />
          </p>
        </div>
        <div className="flex h-10 items-center border-t">
          <SignOutButton redirectUrl="/">
            <div className="flex flex-1 cursor-pointer items-center justify-center gap-2 p-4 text-sm capitalize selection:bg-transparent">
              <ArrowLeft className="size-4" /> Keluar
            </div>
          </SignOutButton>
          <ThemeSwitcher togglePopover={togglePopover} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

const UserSettings: React.FC<{ togglePopover: () => void }> = ({ togglePopover }) => {
  return (
    <Link onClick={togglePopover} href="/dashboard/settings" className="absolute right-3 top-3">
      <Settings className="size-4 stroke-[1.5]" />
    </Link>
  )
}
