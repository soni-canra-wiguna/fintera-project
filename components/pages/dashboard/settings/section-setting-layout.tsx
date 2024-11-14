import { cn } from "@/lib/utils"
import { WithDivElement } from "@/types"

interface SectionSettingLayoutProps extends WithDivElement {
  title: string
}

export const SectionSettingLayout: React.FC<SectionSettingLayoutProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <section className={cn("space-y-4", className)}>
      <h1 className="text-lg font-bold capitalize">{title}</h1>
      {children}
    </section>
  )
}
