import { ThemeSwitcher } from "@/components/theme-switcher"
import { Github } from "lucide-react"

export const SocialMedia = () => {
  return (
    <div className="flex items-center gap-6 text-background dark:text-primary">
      <a className="" href="https://github.com/soni-canra-wiguna" target="_blank">
        <Github className="size-6 stroke-[1.5]" />
      </a>
      <ThemeSwitcher sizeIcon="6" className="w-max border-none p-0" />
    </div>
  )
}
