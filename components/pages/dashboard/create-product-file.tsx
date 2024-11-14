"use client"

import { SectionContent, SectionHeader } from "@/components/section"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import React, { useEffect, useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import { Separator } from "@/components/ui/separator"
import { FileUploadCSV } from "@/components/file-upload"

export const UploadProductFile = () => {
  return (
    <>
      {/* <SectionContent>
        <SectionHeader>Panduan Upload</SectionHeader>
        <GuideCreateProductByFile />
      </SectionContent>
      <div className="relative mb-8 flex h-full w-full items-center justify-center">
        <Separator orientation="horizontal" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-1.5 text-xs capitalize">
          Upload File
        </span>
      </div> */}
      <FileUploadCSV />
    </>
  )
}

export const GuideCreateProductByFile: React.FC<{}> = ({}) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index)
    }
  }
  return (
    <Carousel
      opts={{ align: "center", loop: true }}
      setApi={setApi}
      plugins={[
        Autoplay({
          delay: 4000,
        }) as any,
      ]}
    >
      <CarouselContent>
        <CarouselItem>
          <Card className="gradientCard grid h-[170px] w-full grid-cols-2 overflow-hidden rounded-xl selection:bg-transparent">
            hello world
          </Card>
        </CarouselItem>
        <CarouselItem>
          <Card className="gradientCard grid h-[170px] w-full grid-cols-2 overflow-hidden rounded-xl selection:bg-transparent">
            hello world
          </Card>
        </CarouselItem>
        <CarouselItem>
          <Card className="gradientCard grid h-[170px] w-full grid-cols-2 overflow-hidden rounded-xl selection:bg-transparent">
            hello world
          </Card>
        </CarouselItem>
      </CarouselContent>
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5">
        {Array.from({ length: count }, (_, i) => {
          return (
            <span
              key={i}
              onClick={() => handleDotClick(i)}
              className={`h-[4px] w-6 cursor-pointer rounded-full ${
                current === i + 1 ? "bg-primary" : "bg-muted-foreground/50"
              }`}
            />
          )
        })}
      </div>
    </Carousel>
  )
}
