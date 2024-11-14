import { ThemeSwitcher } from '@/components/theme-switcher'
import { Github } from 'lucide-react';

export const SocialMedia = () => {
  return (
    <div className="absolute right-8 top-8 flex items-center gap-6">
      <a className="" href="https://github.com/soni-canra-wiguna" target="_blank">
        <Github className="size-6" />
      </a>
      <ThemeSwitcher sizeIcon="6" className="w-max border-none p-0" />
    </div>
  )
}
