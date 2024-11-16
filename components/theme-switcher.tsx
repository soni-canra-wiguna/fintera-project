"use client"

import { cn } from "@/lib/utils"
import { WithDivElement } from "@/types"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import React from "react"

interface ThemeSwitcherProps extends WithDivElement {
  togglePopover?: () => void
  sizeIcon?: string
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  togglePopover,
  className,
  sizeIcon = "4",
  ...props
}) => {
  const { theme, setTheme } = useTheme()

  return (
    <div
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light")
        togglePopover?.()
      }}
      className={cn(
        "flex h-full w-16 cursor-pointer items-center justify-center border-l p-4",
        className,
      )}
      {...props}
    >
      {theme === "light" ? (
        <Sun className={`size-${sizeIcon} stroke-[1.5]`} />
      ) : (
        <Moon className={`size-${sizeIcon} stroke-[1.5]`} />
      )}
    </div>
  )
}
