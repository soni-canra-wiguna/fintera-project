"use client"

import * as React from "react"
import { WithChildren } from "@/types"

import { ClerkProvider } from "@clerk/nextjs"
import { store } from "@/redux/store"

import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

const WithClerkProvider = ({ children }: WithChildren) => {
  return <ClerkProvider>{children}</ClerkProvider>
}

const ReduxProvider = ({ children }: WithChildren) => {
  return <Provider store={store}>{children}</Provider>
}

const TanstackQueryProvider = ({ children }: WithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // default: true
            gcTime: 40 * (1000 * 60),
            staleTime: 30 * (1000 * 60),
          },
        },
      }),
  )
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export { WithClerkProvider, TanstackQueryProvider, ReduxProvider, ThemeProvider }
