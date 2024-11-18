"use client"

import { sendGTMEvent } from "@next/third-parties/google"
import { CircleHelp } from "lucide-react"
import Link from "next/link"

export const GoToBlog: React.FC<{ userId: string }> = ({ userId }) => {
  return (
    <Link href="/blog" onClick={() => sendGTMEvent({ event: "go_to_blog_click", user_id: userId })}>
      <CircleHelp className="size-5 stroke-[1.5]" />
    </Link>
  )
}
