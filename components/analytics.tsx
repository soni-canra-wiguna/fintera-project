import { GoogleTagManager } from "@next/third-parties/google"

export const Analytics = () => {
  const measurementId = process.env.NEXT_PUBLIC_MEASUREMENT_ID ?? ""

  return <GoogleTagManager gtmId={measurementId} />
}
