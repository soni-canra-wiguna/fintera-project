import Link from "next/link"
import { Container } from "./container"
import { UserProfile } from "@/components/pages/dashboard/user-profile"
import { SearchBar } from "@/components/pages/dashboard/search"
import { CircleHelp } from "lucide-react"
import { TopBarWrapper } from "./topbar-wrapper"
import { auth } from "@clerk/nextjs/server"

export const TopBar = async () => {
  const { getToken, userId } = auth()
  const token = await getToken()

  return (
    <TopBarWrapper>
      <Container className="flex items-center gap-6 py-3">
        <SearchBar token={token ?? ""} />
        <div className="flex items-center gap-6">
          <Link href="/blog">
            <CircleHelp className="size-5 stroke-[1.5]" />
          </Link>
          <UserProfile userId={userId ?? ""} />
        </div>
      </Container>
    </TopBarWrapper>
  )
}
