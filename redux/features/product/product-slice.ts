"use client"

import { CreateProductRequest } from "@/types/product"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type ProductSliceType = Omit<CreateProductRequest, "description"> & {
  id: string
  quantity: number // jumlah produk yang di tambahkan
  unitPrice: number
}

export type DiscountType = Pick<ProductSliceType, "id"> & {
  discount: number
}

const products = typeof window !== "undefined" ? localStorage.getItem("products") : "[]"

const initialState = {
  products: (JSON.parse(products!) as ProductSliceType[]) || ([] as ProductSliceType[]),
}

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<ProductSliceType>) => {
      state.products.push(action.payload)
    },
    incermentProduct: (state, action: PayloadAction<ProductSliceType>) => {
      const product = state.products.find((product) => product.id === action.payload.id)
      if (!product) {
        state.products.push(action.payload)
        localStorage.setItem("products", JSON.stringify(state.products))
      } else {
        product.quantity += 1
        product.price = product.unitPrice * product.quantity
        localStorage.setItem("products", JSON.stringify(state.products))
      }
    },
    decrementProduct: (state, action: PayloadAction<ProductSliceType>) => {
      const product = state.products.find((product) => product.id === action.payload.id)
      if (product && product.quantity > 1) {
        product.quantity -= 1
        product.price = product.unitPrice * product.quantity
        localStorage.setItem("products", JSON.stringify(state.products))
      } else if (product && product.quantity === 1) {
        product.quantity = 1
        product.price = product.unitPrice
        localStorage.setItem("products", JSON.stringify(state.products))
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((product) => product.id !== action.payload)
      localStorage.setItem("products", JSON.stringify(state.products))
    },
    resetProduct: (state) => {
      state.products = []
      localStorage.setItem("products", JSON.stringify(state.products))
    },
    discountProduct: (state, action: PayloadAction<DiscountType>) => {
      const product = state.products.find((product) => product.id === action.payload.id)
      if (product) {
        product.price -= action.payload.discount
      }
      localStorage.setItem("products", JSON.stringify(state.products))
    },
  },
})

export const {
  addProduct,
  incermentProduct,
  decrementProduct,
  removeProduct,
  resetProduct,
  discountProduct,
} = productSlice.actions
export default productSlice.reducer
