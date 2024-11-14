"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "use-debounce"
import { useQuery } from "@tanstack/react-query"
import { Product } from "@prisma/client"
import { useAuth } from "@clerk/nextjs"
import { Loader2, SearchIcon, XIcon, ArrowUpFromLine, ChevronDown } from "lucide-react"
import { ProductCard } from "./product-card"
import { Container } from "@/components/layout/container"
import { TokenProps } from "@/types"
import { searchProductsServices } from "@/services/product.services"
import { SearchByType } from "@/app/api/products/search/route"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterSeachProductProps {
  searchBy: SearchByType
  setSearchBy: (searchBy: SearchByType) => void
}

const FilterSeachProduct: React.FC<FilterSeachProductProps> = ({ searchBy, setSearchBy }) => {
  const filterItems: { label: string; value: SearchByType }[] = [
    {
      label: "nama",
      value: "productName",
    },
    {
      label: "sku",
      value: "sku",
    },
    {
      label: "kategori",
      value: "category",
    },
  ]

  return (
    <Select defaultValue={searchBy} value={searchBy} onValueChange={setSearchBy}>
      <SelectTrigger className="focus:ring-none border-l-none border-y-none h-8 w-max gap-1.5 rounded-l-lg rounded-r-none border-r border-r-secondary-foreground/10 bg-secondary focus:ring-0">
        <SelectValue placeholder="cari" className="" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          {filterItems.map((item) => (
            <SelectItem className="capitalize" key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export const SearchBar: React.FC<TokenProps> = ({ token }) => {
  const { userId } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [searchInput, setSeachInput] = useState("")
  const [searchBy, setSearchBy] = useState<SearchByType>("productName")
  const [debounceSearchInput] = useDebounce(searchInput.replace(/\s+/g, "-"), 500)

  const {
    data: searchResults,
    isPending,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["search_input", debounceSearchInput, searchBy],
    queryFn: () =>
      searchProductsServices({ query: debounceSearchInput, searchBy, token, userId: userId ?? "" }),
    enabled: !!debounceSearchInput && !!searchBy,
  })

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative flex h-8 w-full cursor-text rounded-lg bg-secondary selection:bg-transparent">
          <span className="absolute left-2.5 top-1/2 flex -translate-y-1/2 items-center gap-2 text-sm capitalize text-muted-foreground">
            <SearchIcon className="size-4 text-inherit" />
            cari produk
          </span>
        </div>
      </SheetTrigger>
      <SheetContent side="top" className="h-max w-full px-0 py-4">
        <SheetHeader className="sr-only">
          <SheetTitle>cari produk</SheetTitle>
          <SheetDescription>cari produk yang kamu suka</SheetDescription>
        </SheetHeader>
        <Container className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-row-reverse items-center">
            <div className="relative h-max w-full">
              <Input
                className="h-8 rounded-l-none rounded-r-lg border-none bg-secondary px-4 text-sm placeholder:text-sm placeholder:capitalize focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                placeholder="cari produk"
                value={searchInput}
                onChange={(e) => setSeachInput(e.target.value)}
              />
              {searchInput.length > 0 && (
                <XIcon
                  onClick={() => setSeachInput("")}
                  className="absolute-vertical right-2 z-50 size-4 cursor-pointer text-destructive"
                />
              )}
            </div>
            <FilterSeachProduct searchBy={searchBy} setSearchBy={setSearchBy} />
          </div>
          {/* render search results */}
          {debounceSearchInput.length === 0 ? null : isPending ? (
            <div className="flex items-center justify-center">
              <Loader2 className="size-6 animate-spin stroke-[1.5]" />
            </div>
          ) : searchResults?.length === 0 ? (
            <div className="text-center">produk tidak di temukan</div>
          ) : isError ? (
            <p className="text-center">koneksi kamu lambat, coba lagi</p>
          ) : (
            <div className="flex max-h-[500px] w-full flex-col gap-4 overflow-y-auto transition-all">
              {searchResults.map((result) => (
                <ProductCard product={result} key={result.id} userId={userId!} token={token} />
              ))}
            </div>
          )}
        </Container>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="link"
          className="absolute -bottom-12 right-6 px-0 capitalize tracking-wide text-white"
        >
          <ArrowUpFromLine className="mr-1.5 size-4" />
          tutup
        </Button>
      </SheetContent>
    </Sheet>
  )
}
