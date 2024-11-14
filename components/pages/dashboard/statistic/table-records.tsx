"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatToIDR } from "@/utils/format-to-idr"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react"
import React, { useState } from "react"
import { id } from "date-fns/locale"
import Link from "next/link"
import { salesRecordsPaginationServices } from "@/services/sales-records.services"
import { SalesRecordsPaginationResponse } from "@/types/sales-record"
import { WithTokenAndUserId } from "@/types"

type handleSortByType = "price" | "date" | "qty"

const TableRecords: React.FC<WithTokenAndUserId> = ({ token, userId }) => {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState("date-desc")
  const [limit, setLimit] = useState("20")

  const { data, isPending, isError } = useQuery<SalesRecordsPaginationResponse>({
    queryKey: ["pagging_salesrecord", sortBy, page, limit],
    queryFn: () =>
      salesRecordsPaginationServices({
        sortBy,
        page,
        limit,
        token,
        userId,
      }),
  })

  const handleSortBy = (type: handleSortByType) => {
    if (type === "price") {
      setSortBy((prev) => (prev === "price-high" ? "price-low" : "price-high"))
    } else if (type === "date") {
      setSortBy((prev) => (prev === "date-desc" ? "date-asc" : "date-desc"))
    } else if (type === "qty") {
      setSortBy((prev) => (prev === "quantity-high" ? "quantity-low" : "quantity-high"))
    }
  }
  // @ts-ignore
  if (data?.data?.length <= 0)
    return (
      <Card className="gradientCard flex h-40 items-center justify-center rounded-xl p-4">
        <p className="text-sm text-muted-foreground">Belum ada yang terjual nih</p>
      </Card>
    )

  if (isError)
    return (
      <Card className="gradientCard flex h-40 items-center justify-center rounded-xl p-4">
        <p className="text-sm text-muted-foreground">Ada yang salah nih, coba refresh lagi deh</p>
      </Card>
    )

  return (
    <Card className="gradientCard h-full max-w-[480px] overflow-hidden rounded-xl">
      <CardContent className="scrollbar-hide h-full max-h-[350px] w-full overflow-y-auto px-4 pb-0 pt-4">
        {isPending ? (
          <LoadingTableProduct />
        ) : (
          <div className="w-[1200px] overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-32 border p-3 capitalize">SKU Produk</th>
                  <th className="w-60 border p-3 capitalize">Nama Produk</th>
                  <th className="w-32 border p-3 capitalize">kategori</th>
                  <th className="w-36 border p-3 capitalize">Gambar</th>
                  <th className="w-36 border p-3 capitalize" onClick={() => handleSortBy("price")}>
                    <div className="flex items-center justify-center gap-2">
                      harga <ChevronsUpDown className="size-3" />
                    </div>
                  </th>
                  <th className="w-24 border p-3 capitalize" onClick={() => handleSortBy("qty")}>
                    <div className="flex items-center justify-center gap-2">
                      jumlah <ChevronsUpDown className="size-3" />
                    </div>
                  </th>
                  <th className="w-40 border p-3 capitalize">total harga</th>
                  <th className="border p-3 capitalize" onClick={() => handleSortBy("date")}>
                    <div className="flex items-center justify-center gap-2">
                      tanggal <ChevronsUpDown className="size-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <TableList data={data} />
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between gap-6 p-4">
        <Select onValueChange={setLimit} defaultValue={limit}>
          <SelectTrigger className="w-max gap-2">
            <SelectValue placeholder="pilih" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="text-sm">
              <SelectLabel className="capitalize">baris halaman</SelectLabel>
              <SelectItem className="text-sm" value="10">
                10
              </SelectItem>
              <SelectItem className="text-sm" value="20">
                20
              </SelectItem>
              <SelectItem className="text-sm" value="30">
                30
              </SelectItem>
              <SelectItem className="text-sm" value="40">
                40
              </SelectItem>
              <SelectItem className="text-sm" value="50">
                50
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center justify-center gap-4">
          <Button
            size="xs"
            className="rounded-xl p-2"
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1 || isPending}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <p className="text-sm">
            halaman {data?.currentPage} dari {data?.totalPages}
          </p>
          <Button
            size="xs"
            className="rounded-xl p-2"
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === data?.totalPages || isPending}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default TableRecords

export const LoadingTableProduct = () => {
  const loading = Array.from({ length: 4 }, (_, i) => (
    <Skeleton
      key={i}
      className="gradientCard shimmer scrollbar-hide h-8 w-full rounded-md bg-secondary text-card-foreground shadow-sm"
    />
  ))

  return <div className="flex flex-col gap-2">{loading}</div>
}

const TableList: React.FC<{ data: SalesRecordsPaginationResponse | undefined }> = ({ data }) => {
  const tableItem = data?.data.map((p) => {
    const formattedDate = format(p.createdAt, "EEE, dd MMM yyyy", {
      locale: id,
    })
    return (
      <tr key={p.id} className="selection:bg-transparent">
        <td className="w-32 truncate border p-3 text-left">{p.sku?.slice(0, 10)}...</td>
        <td className="max-w-60 truncate border p-3">{p.title}</td>
        <td className="w-32 border p-3 text-center">
          <Badge variant="secondary" className="capitalize">
            {p.category}
          </Badge>
        </td>
        <td className="w-36 truncate border p-3 text-left">
          <Link href={p.image} target="_blank" className="truncate text-main">
            {p.image.slice(0, 17)}...
          </Link>
        </td>
        <td className="w-36 border p-3 text-left">{formatToIDR(p.price)}</td>
        <td className="w-24 border p-3 text-center">{p.quantity}</td>
        <td className="w-40 border p-3 text-left">{formatToIDR(p.totalPrice)}</td>
        <td className="border p-3 text-left tracking-wide">{formattedDate}</td>
      </tr>
    )
  })

  return <>{tableItem}</>
}
