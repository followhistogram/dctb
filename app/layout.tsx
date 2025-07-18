import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutProvider } from "@/components/layout-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dělej co tě baví - Nezisková organizace pro mladé",
  description:
    "Pomáháme mladým lidem najít svou cestu, rozvíjet talenty a realizovat své sny. Připojte se k naší komunitě a objevte nové možnosti.",
  keywords: ["nezisková organizace", "mladí lidé", "rozvoj", "talenty", "komunita", "projekty"],
  authors: [{ name: "Dělej co tě baví" }],
  openGraph: {
    title: "Dělej co tě baví - Nezisková organizace pro mladé",
    description:
      "Pomáháme mladým lidem najít svou cestu, rozvíjet talenty a realizovat své sny. Připojte se k naší komunitě a objevte nové možnosti.",
    type: "website",
    locale: "cs_CZ",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className={inter.className}>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  )
}
