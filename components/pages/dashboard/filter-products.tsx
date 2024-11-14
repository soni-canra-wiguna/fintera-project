"use client"

import React, { useState } from "react"
import {
  ArrowDownAZ,
  ArrowDownZA,
  Settings2,
  ArrowUpDown,
  ArrowDownUp,
  ArrowUp10,
  ArrowDown01,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Options, useQueryState } from "nuqs"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const filterItems = [
  {
    label: "terbaru",
    value: "new",
    icon: ArrowUpDown,
  },
  {
    label: "terlama",
    value: "old",
    icon: ArrowDownUp,
  },
  {
    label: "a - z",
    value: "a-z",
    icon: ArrowDownAZ,
  },
  {
    label: "z - a",
    value: "z-a",
    icon: ArrowDownZA,
  },
  {
    label: "harga : termurah",
    value: "price-low",
    icon: ArrowDownUp,
  },
  {
    label: "harga : termahal",
    value: "price-high",
    icon: ArrowUpDown,
  },
  {
    label: "Stock : terbanyak",
    value: "stock-high",
    icon: ArrowUp10,
  },
  {
    label: "stock : tersedikit",
    value: "stock-low",
    icon: ArrowDown01,
  },
]

type FilterItem = (typeof filterItems)[0]
type FilterItemProps = {
  item: FilterItem
  sortBy: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  setSortBy: <Shallow>(
    value: string | ((old: string) => string | null) | null,
    options?: Options<Shallow> | undefined,
  ) => Promise<URLSearchParams>
}

export const FilterProducts = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [sortBy, setSortBy] = useQueryState("sortBy", {
    history: "push",
    defaultValue: "new",
  })

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="size-9">
          <Settings2 className="size-4 stroke-[1.5]" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mobileDrawer">
        <DrawerHeader className="sr-only">
          <DrawerTitle>filter produk</DrawerTitle>
          <DrawerDescription>filter produk dengan berbagai pilihan</DrawerDescription>
        </DrawerHeader>
        <div className="scrollbar-hide h-full max-h-[450px] w-full overflow-y-auto p-4">
          <div className="flex flex-col gap-2">
            {filterItems.map((item) => (
              <FilterItem
                key={item.label}
                item={item}
                sortBy={sortBy}
                setSortBy={setSortBy}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

const FilterItem: React.FC<FilterItemProps> = ({ item, sortBy, setSortBy, isOpen, setIsOpen }) => {
  return (
    <button
      onClick={() => {
        setSortBy(item.value)
        setIsOpen(!isOpen)
      }}
      key={item.label}
      className={cn(
        "capitaize group relative flex w-full items-center gap-3 rounded-md px-4 py-2 text-left text-sm capitalize hover:bg-main/10",
        sortBy === item.value && "bg-main/10",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 hidden h-6 w-1 -translate-y-1/2 rounded-lg bg-main group-hover:inline",
          sortBy === item.value && "inline",
        )}
      />
      <item.icon className="size-4 stroke-[1.5]" />
      {item.label}
    </button>
  )
}

export const FallbackFilterButton = () => {
  return (
    <Button variant="outline" size="icon" className="size-9">
      <Settings2 className="size-4 stroke-[1.5]" />
    </Button>
  )
}
