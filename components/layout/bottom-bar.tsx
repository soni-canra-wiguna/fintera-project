import React from "react"
import { Container } from "./container"
import { BottomBarNavigation } from "./bottom-bar-navigation"

export const BottomBar = () => {
  return (
    <header className="fixed bottom-0 left-0 z-50 w-full border-t bg-background">
      <Container className="flex h-full items-center justify-between px-16 py-2">
        <BottomBarNavigation />
      </Container>
    </header>
  )
}
