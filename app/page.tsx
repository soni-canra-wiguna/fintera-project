import Image from "next/image"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Container } from "@/components/layout/container"
import FlickeringGrid from "@/components/ui/flickering-grid"
import { MainContainer } from "@/components/layout/main-container"
import { SocialMedia } from "@/components/pages/home/social-media"
import { AuthButton } from "@/components/pages/home/auth-button"

export default function Home() {
  const { userId } = auth()

  if (userId) redirect("/dashboard")

  return (
    <MainContainer className="h-screen overflow-hidden">
      <Container className="relative flex h-full flex-col items-center justify-between overflow-hidden pb-8 pt-48">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="relative mb-6 size-16">
            <Image alt="logo" className="grayscale" src="/notacore.png" fill />
          </div>
          <h1 className="mb-2 text-center text-4xl font-bold uppercase">notacore</h1>
          <p className="mb-10 text-center text-sm text-muted-foreground">
            Catat hasil penjualanmu dan lihatlah hasilnya!
          </p>
        </div>
        <AuthButton />

        <SocialMedia />
        <FlickeringGrid
          className="absolute inset-0 -z-20 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.5}
          flickerChance={0.1}
          height={800}
          width={480}
        />
        {/* overlay bottom */}
        <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-full bg-gradient-to-t from-background" />
      </Container>
    </MainContainer>
  )
}
