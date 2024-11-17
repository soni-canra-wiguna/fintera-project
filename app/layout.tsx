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
import { GoogleAnalytics } from "@/components/analytics"

export const metadata: Metadata = {
  title: {
    default: "Notacore",
    template: "%s | Notacore - Aplikasi Catatan Penjualan",
  },
  description:
    "Notacore adalah aplikasi catatan penjualan yang membantu bisnis mencatat dan mengelola transaksi dengan mudah dan cepat.",
  referrer: "origin-when-cross-origin",
  applicationName: "Notacore",
  icons: {
    icon: "/notacore.png",
    apple: "/notacore.png", // Ikon untuk dukungan iOS
  },
  // verification: {
  //   google: process.env.GOOGLE_SITE_VERIFICATION,
  // },
  keywords: [
    "catatan penjualan",
    "aplikasi bisnis",
    "notacore",
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
  authors: [{ name: "Soni Canra Wiguna", url: "https://instagram.com/sonicanra" }],
  creator: "Soni Canra Wiguna",
  publisher: "Soni Canra Wiguna",
  generator: "Next.Js 14.2",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true, // Mengizinkan Googlebot mengikuti tautan
      noimageindex: false, // Membolehkan pengindeksan gambar
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(process.env.PRODUCTION_URL as string),
  alternates: {
    canonical: process.env.PRODUCTION_URL,
    // languages: {
    //   "id-ID": "https://notacore.vercel.app/id",
    //   "en-US": "https://notacore.vercel.app/en",
    // },
  },
  openGraph: {
    title: {
      default: "Notacore - Aplikasi Catatan Penjualan",
      template: "%s | Notacore",
    },
    description:
      "Kelola dan catat transaksi penjualan bisnis Anda dengan Notacore. Mudah digunakan, cepat, dan efisien.",
    url: process.env.PRODUCTION_URL,
    images: [
      {
        url: "https://utfs.io/f/5e90efc6-f787-4db9-84b0-56a6ee939e02-jn3obm.png",
        width: 1200,
        height: 630,
        alt: "Notacore - Aplikasi Catatan Penjualan", // Teks alternatif untuk aksesibilitas
      },
    ],
    type: "website",
    locale: "id_ID",
    siteName: "Notacore",
  },
  twitter: {
    card: "summary_large_image", // Kartu Twitter untuk visibilitas lebih baik di media sosial
    site: "@NotacoreApp",
    creator: "@SoniCanra",
    title: "Notacore - Solusi Catatan Penjualan Bisnis",
    description: "Notacore membantu bisnis mencatat dan melacak penjualan dengan efisien.",
    images: [
      {
        url: "https://utfs.io/f/5e90efc6-f787-4db9-84b0-56a6ee939e02-jn3obm.png",
        alt: "Notacore Banner",
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
            {/* <GoogleAnalytics /> */}
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
