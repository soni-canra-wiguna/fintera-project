import { Container } from "./container"
import { UserProfile } from "@/components/pages/dashboard/user-profile"
import { SearchBar } from "@/components/pages/dashboard/search"
import { TopBarWrapper } from "./topbar-wrapper"
import { auth } from "@clerk/nextjs/server"
import { GoToBlog } from "./go-to-blog"

export const TopBar = async () => {
  const { getToken, userId } = auth()
  const token = await getToken()

  return (
    <TopBarWrapper>
      <Container className="flex items-center gap-6 py-3">
        <SearchBar token={token ?? ""} />
        <div className="flex items-center gap-6">
          <GoToBlog userId={userId ?? ""} />
          <UserProfile userId={userId ?? ""} />
        </div>
      </Container>
    </TopBarWrapper>
  )
}
