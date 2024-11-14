"use client"

import React from "react"
import { ProductCard } from "./product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Frown, Loader2, PackageOpen } from "lucide-react"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useQueryState } from "nuqs"
import { TokenProps } from "@/types"
import { listsProductsServices } from "@/services/product.services"

interface ListProducts extends TokenProps {
  userId: string
}

export const LoadingListProducts: React.FC<{
  type: "loading" | "fallback"
  lengthLoading?: number
}> = ({ type, lengthLoading = 4 }) => {
  const loadings = Array.from({ length: lengthLoading }, (_, i) => {
    return <Skeleton variant="shimmer" className="h-24 w-full rounded-xl" key={i} />
  })

  if (type === "loading") {
    return <>{loadings}</>
  }

  return <div className="flex h-full flex-col gap-4">{loadings}</div>
}

const ListsProducts: React.FC<ListProducts> = ({ userId, token }) => {
  const [sortBy] = useQueryState("sortBy", {
    defaultValue: "new",
    history: "push",
  })

  const { ref, inView } = useInView()
  const {
    data,
    isPending,
    isSuccess,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lists_products", sortBy],
    queryFn: ({ pageParam = 1 }) => listsProductsServices({ pageParam, sortBy, token, userId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const products = data?.pages?.flatMap((page) => page.data)

  if (isPending) {
    return (
      <div className="flex h-full flex-col gap-4">
        <LoadingListProducts type="loading" />
      </div>
    )
  }

  if (products?.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 pt-40 text-center">
        <PackageOpen className="size-16" strokeWidth={1} />
        <p className="max-w-[60vw]">Belum ada produknya nih, Yuk tambahin😆!</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 pt-40 text-center">
        <Frown className="size-16" strokeWidth={1} />
        <p className="max-w-[60vw]">Ada yang salah nih, coba refresh lagi deh😞</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full flex-col gap-4">
        {isSuccess &&
          products?.map((product) => (
            <ProductCard product={product} key={product.id} userId={userId} token={token} />
          ))}
      </div>
      <div ref={ref} className="mb-8 mt-4 flex w-full items-center justify-center">
        {isFetchingNextPage && (
          <p className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin text-primary" /> Load more...
          </p>
        )}
      </div>
    </>
  )
}

export default ListsProducts
