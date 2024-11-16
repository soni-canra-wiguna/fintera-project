"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import React from "react"
import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/file-upload"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UNIT_PRODUCTS } from "@/constants/units"
import { Label } from "@/components/ui/label"
import { formatToIDR } from "@/utils/format-to-idr"
import { LoadingButton } from "@/components/loading-button"
import { Button } from "@/components/ui/button"
import { FileSearch } from "lucide-react"
import { PreviewDetailProduct } from "./preview-product"
import { TextEditor } from "@/components/text-editor"
import { Product } from "@prisma/client"
import { InferProductSchemaType } from "@/types/product"

export interface ProductFormProps {
  form: UseFormReturn<InferProductSchemaType>
  onSubmit: (data: InferProductSchemaType) => void
  isPending: boolean
  label: "create" | "update"
  previewProduct: Product
}

export const ProductForm: React.FC<ProductFormProps> = ({
  label,
  form,
  onSubmit,
  isPending,
  previewProduct,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full space-y-6">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <FileUpload endpoint="product" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Title produk</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="masukkan nama produk" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Deskripsi produk (optional)</FormLabel>
                <FormControl>
                  <TextEditor value={field.value!} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <div className="flex w-full items-start gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => {
              return (
                <FormItem className="flex-1">
                  <FormLabel>Harga produk</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="masukkan nominal harga" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <div className="space-y-2">
            <Label>Preview harga</Label>
            <div className="flex h-10 w-full items-center rounded-xl bg-secondary px-4">
              {formatToIDR(form.watch("price"))}
            </div>
          </div>
        </div>
        <div className="flex w-full items-start gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => {
              return (
                <FormItem className="flex-1">
                  <FormLabel>Jumlah produk</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="jumlah produk tersedia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          {/* unit / satuan */}
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Satuan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="satuan produk" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent align="end">
                      <SelectGroup>
                        {UNIT_PRODUCTS.map((unit) => (
                          <SelectItem className="capitalize" key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>SKU (optional)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="masukkan nomor sku" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>kategori produk</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="masukkan kategori" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <div className="flex flex-col gap-2.5 pt-3">
          <LoadingButton
            type="submit"
            loading={isPending}
            disabled={isPending}
            className="w-full capitalize"
          >
            {label} produk
          </LoadingButton>
          <PreviewDetailProduct product={previewProduct}>
            <Button className="w-full" variant="outline">
              <FileSearch className="mr-2 size-4" /> preview
            </Button>
          </PreviewDetailProduct>
        </div>
      </form>
    </Form>
  )
}
