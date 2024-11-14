"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WithTokenAndUserId } from "@/types"
import { FormCreateProduct } from "./form-create-product"
import { UploadProductFile } from "./create-product-file"

export const CreateProductTabs: React.FC<WithTokenAndUserId> = ({ userId, token }) => {
  return (
    <Tabs defaultValue="manual">
      <TabsList className="w-full">
        <TabsTrigger className="flex-1" value="manual">
          Manual
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="all">
          Sekaligus
        </TabsTrigger>
      </TabsList>
      <TabsContent className="mt-6" value="manual">
        <FormCreateProduct userId={userId ?? ""} token={token ?? ""} />
      </TabsContent>
      <TabsContent className="mt-6" value="all">
        <UploadProductFile />
      </TabsContent>
    </Tabs>
  )
}
