"use client"

import { usePathname } from "next/navigation"
import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith("/admin")

  return (
    <>
      {!isAdminPage && <Header />}
      <main>{children}</main>
      {!isAdminPage && <Footer />}
    </>
  )
}
