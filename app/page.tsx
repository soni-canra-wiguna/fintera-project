import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Container } from "@/components/layout/container"
import { MainContainer } from "@/components/layout/main-container"
import { SocialMedia } from "@/components/pages/home/social-media"
import { AuthButton } from "@/components/pages/home/auth-button"
import { HyperText } from "@/components/ui/hyper-text"
import { Chakra_Petch } from "next/font/google"

const cpFont = Chakra_Petch({
  weight: ["600", "700"],
  subsets: ["latin"],
})
export default function Home() {
  const { userId } = auth()

  if (userId) redirect("/dashboard")

  return (
    <MainContainer className="h-screen overflow-hidden">
      <Container className="relative flex h-full flex-col items-center justify-between overflow-hidden border-x border-border/40 pb-8 pt-6">
        <div className="flex w-full items-center justify-between">
          <HyperText
            className={`mb-2 text-center text-2xl font-bold ${cpFont.className}`}
            text="Fintera"
            duration={500}
          />
          <SocialMedia />
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <h1
            className={`mb-4 text-balance text-center text-4xl font-bold text-background dark:text-primary ${cpFont.className}`}
          >
            Solusi Tepat untuk Catatan Keuangan.
          </h1>
          <p className="text-balance text-center text-sm font-medium text-muted-foreground">
            Fintera membantu Anda mencatat dan mengoptimalkan penjualan dengan mudah.
          </p>
        </div>
        <AuthButton />

        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        {/* overlay bottom */}
        <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-full bg-gradient-to-t dark:from-background" />
      </Container>
    </MainContainer>
  )
}
