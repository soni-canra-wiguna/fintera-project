import { Button } from "@/components/ui/button"
import Link from "next/link"

export const AuthButton = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <Link className="w-full" href="/sign-in">
        <Button size="lg" className="w-full rounded-xl capitalize">
          Sign In
        </Button>
      </Link>
      <Link className="w-full" href="/sign-up">
        <Button variant="outline" size="lg" className="w-full rounded-xl capitalize">
          Daftar
        </Button>
      </Link>
    </div>
  )
}
