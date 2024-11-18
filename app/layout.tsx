import "@/styles/globals.css"

import {
  WithClerkProvider,
  TanstackQueryProvider,
  ReduxProvider,
  ThemeProvider,
} from "@/components/provider"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import NextTopLoader from "nextjs-toploader"
import { Toaster } from "@/components/ui/toaster"
import { MAIN_COLOR } from "@/constants/colors"
import { WithChildren } from "@/types"
import { Analytics } from "@/components/analytics"

export const metadata: Metadata = {
  title: {
    default: "Fintera",
    template: "%s | Fintera - Solusi Tepat untuk Catatan Keuangan.",
  },
  description:
    "Fintera adalah aplikasi catatan penjualan dan pengelola keuangan yang membantu bisnis mencatat dan mengelola transaksi dengan mudah dan cepat.",
  referrer: "origin-when-cross-origin",
  applicationName: "Fintera",
  icons: {
    icon: "fr-icon.png",
    apple: "fr-icon.png", // Ikon untuk dukungan iOS
  },
  keywords: [
    "catatan penjualan",
    "aplikasi bisnis",
    "Fintera",
    "pencatatan transaksi",
    "pengelolaan penjualan",
    "invoice online",
    "tracking transaksi",
    "bisnis kecil",
    "manajemen penjualan",
    "aplikasi keuangan",
    "penjualan harian",
    "solusi bisnis",
    "laporan penjualan",
  ],
  authors: [{ name: "Soni Canra Wiguna", url: "https://instagram.com/canra_514" }],
  creator: "Soni Canra Wiguna",
  publisher: "Soni Canra Wiguna",
  generator: "Next.Js 14.2.15",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false, // Membolehkan pengindeksan gambar
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(process.env.PRODUCTION_URL as string),
  alternates: {
    canonical: process.env.PRODUCTION_URL,
  },
  openGraph: {
    title: {
      default: "Fintera - Solusi Tepat untuk Catatan Keuangan.",
      template: "%s | Fintera",
    },
    description:
      "Kelola dan catat transaksi penjualan bisnis Anda dengan Fintera. Mudah digunakan, cepat, dan efisien.",
    url: process.env.PRODUCTION_URL,
    images: [
      {
        url: "https://utfs.io/f/qmMCwF8GSxijEmlMXz77a4pzVbwW2gO5YNUs83iIMBql60XR",
        width: 1200,
        height: 630,
        alt: "Fintera - Solusi Tepat untuk Catatan Keuangan.", // Teks alternatif untuk aksesibilitas
      },
    ],
    type: "website",
    locale: "id_ID",
    siteName: "Fintera",
  },
  twitter: {
    card: "summary_large_image", // Kartu Twitter untuk visibilitas lebih baik di media sosial
    site: "https://fintera.vercel.app",
    creator: "@SoniCanraWiguna",
    title: "Fintera - Solusi Catatan Penjualan Bisnis",
    description: "Fintera membantu bisnis mencatat dan melacak penjualan dengan efisien.",
    images: [
      {
        url: "https://utfs.io/f/qmMCwF8GSxijEmlMXz77a4pzVbwW2gO5YNUs83iIMBql60XR",
        alt: "Fintera Banner",
      },
    ],
  },
}

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus_jakarta_sans",
})

export default function RootLayout({ children }: Readonly<WithChildren>) {
  return (
    <WithClerkProvider>
      <TanstackQueryProvider>
        <ReduxProvider>
          <html lang="en">
            <Analytics />
            <body className={plusJakartaSans.className}>
              <NextTopLoader color={MAIN_COLOR} height={3} showSpinner={false} />
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
              <Toaster />
            </body>
          </html>
        </ReduxProvider>
      </TanstackQueryProvider>
    </WithClerkProvider>
  )
}
