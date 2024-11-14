import { ContactDeveloper } from "@/components/pages/dashboard/settings/contact-developer"
import { DeteleAccount } from "@/components/pages/dashboard/settings/delete-account"
import { SectionSettingLayout } from "@/components/pages/dashboard/settings/section-setting-layout"
import { MainContainer } from "@/components/layout/main-container"
import { Container } from "@/components/layout/container"
import { auth } from "@clerk/nextjs/server"

const SettingsPage = async () => {
  const { userId, getToken } = auth()
  const token = await getToken()

  return (
    <MainContainer>
      <Container className="my-20">
        <SectionSettingLayout title="akun" className="mb-8">
          <DeteleAccount token={token ?? ""} userId={userId ?? ""} />
        </SectionSettingLayout>
        <SectionSettingLayout title="kontak developer">
          <ContactDeveloper />
        </SectionSettingLayout>
      </Container>
    </MainContainer>
  )
}

export default SettingsPage
