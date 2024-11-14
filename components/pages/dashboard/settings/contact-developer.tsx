import { Github, Mail } from "lucide-react"

export const ContactDeveloper = () => {
  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-2 text-sm">
        <Mail className="stroke-[1.5] text-xs" />
        <a href="mailto:sonicanrawiguna@gmail.com" className="text-main">
          sonicanrawiguna@gmail.com
        </a>
      </p>
      <p className="flex items-center gap-2 text-sm">
        <Github className="stroke-[1.5] text-xs" />
        <a href="https://github.com/soni-canra-wiguna" className="text-main" target="_blank">
          Github
        </a>
      </p>
    </div>
  )
}
