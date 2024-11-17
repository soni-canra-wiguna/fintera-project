import Script from "next/script"

export const GoogleAnalytics = () => {
  const measurementId = process.env.NEXT_PUBLIC_MEASUREMENT_ID ?? ""

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />

      <Script id="" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
          page_path: window.location.pathname,
          });
      `}
      </Script>
    </>
  )
}
