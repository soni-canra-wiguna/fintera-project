import axios from "axios"
import { Product } from "@prisma/client"

import { SearchByType } from "@/app/api/products/search/route"
import { ProductSliceType } from "@/redux/features/product/product-slice"
import { DataProps, WithTokenAndUserId } from "@/types"
import { InferProductSchemaType, ProductResponse, SearchResponse } from "@/types/product"

interface ListsProductsServicesProps extends WithTokenAndUserId {
  pageParam: number
  sortBy: string
}

interface searchServicesProps extends WithTokenAndUserId {
  query: string
  searchBy: SearchByType
}

interface CreateProductServicesProps
  extends WithTokenAndUserId,
    DataProps<InferProductSchemaType> {}

interface UpdateStockProps extends WithTokenAndUserId {
  products: ProductSliceType[]
}

export class ProductServices {
  static async listsProducts({
    pageParam,
    sortBy,
    token,
    userId,
  }: ListsProductsServicesProps): Promise<ProductResponse> {
    const { data }: { data: ProductResponse } = await axios.get(
      `/api/products?sortBy=${sortBy}&page=${+pageParam}&limit=${20}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId,
        },
      },
    )
    return data
  }

  static async searchProducts({
    query,
    token,
    userId,
    searchBy,
  }: searchServicesProps): Promise<Product[]> {
    const { data }: { data: SearchResponse } = await axios.get(
      `/api/products/search?query=${query}&searchBy=${searchBy}`,
      {
        headers: {
          Authorization: token,
          userId,
        },
      },
    )
    return data.data
  }

  static async create({ userId, token, data }: CreateProductServicesProps) {
    await axios.post("/api/products", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        userId: userId,
      },
    })
  }

  static async updateStock({ token, userId, products }: UpdateStockProps) {
    await Promise.all(
      products.map((product) =>
        axios.patch(
          `/api/products/${product.id}`,
          {
            stock: product.stock - product.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId,
            },
          },
        ),
      ),
    )
  }
}
