import { cn } from "@/lib/utils"
import { WithDivElement } from "@/types"

export const Container: React.FC<WithDivElement> = ({ children, className, ...props }) => {
  return (
    <section
      className={cn("mx-auto w-full max-w-md px-4 sm:px-6 md:px-8 lg:px-10", className)}
      {...props}
    >
      {children}
    </section>
  )
}
