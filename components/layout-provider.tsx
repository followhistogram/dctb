"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { getSiteSettings } from "@/lib/settings-actions"
import { CookieConsentBanner } from "./cookie-consent-banner"

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSiteSettings()
        if (settings?.logo_url) {
          setLogoUrl(settings.logo_url)
        }
      } catch (error) {
        console.error("Error fetching settings in LayoutProvider:", error)
      }
    }
    fetchSettings()
  }, [])

  if (pathname.startsWith("/admin")) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen">
        <Header logoUrl={logoUrl} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      <Toaster />
      <CookieConsentBanner />
    </ThemeProvider>
  )
}
