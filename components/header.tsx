"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Calendar } from "lucide-react" // Ensure Calendar is imported
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getSiteSettings } from "@/lib/settings-actions"

const navigation = [
  { name: "Domů", href: "/" },
  { name: "O nás", href: "/o-nas" },
  { name: "Projekty", href: "/projekty" },
  { name: "Události", href: "/udalosti" },
  { name: "Aktuality", href: "/aktuality" },
  { name: "Reference", href: "/reference" },
  { name: "Partneři", href: "/partneri" },
  { name: "Kontakt", href: "/kontakt" },
]

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState("/logo.png")

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const settings = await getSiteSettings()
        if (settings.logo_url) {
          setLogoUrl(settings.logo_url)
        }
      } catch (error) {
        console.error("Error fetching logo:", error)
        // Keep default logo on error
      }
    }

    fetchLogo()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-[#111] border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt="Dělej co tě baví logo"
              width={60} // Zvětšená šířka
              height={60} // Zvětšená výška
              className="h-12 w-auto transition-transform group-hover:scale-105" // Upravené třídy pro větší logo
              onError={() => setLogoUrl("/logo.png")} // Fallback on error
            />
            
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  pathname === item.href ? "text-white border-b-2 border-white pb-1" : "text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link href="/udalosti">
              <Button className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Nejbližší akce {/* Změněný text tlačítka */}
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Otevřít menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-[#111] border-gray-800">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <Image
                    src={logoUrl || "/placeholder.svg"}
                    alt="Dělej co tě baví logo"
                    width={48} // Zvětšená šířka pro mobil
                    height={48} // Zvětšená výška pro mobil
                    onError={() => setLogoUrl("/logo.png")}
                  />
                  <span className="text-white font-bold">Dělej co tě baví</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-white ${
                      pathname === item.href ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="pt-4 border-t border-gray-800">
                <Link href="/udalosti">
                  <Button className="w-full bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Nejbližší akce {/* Změněný text tlačítka pro mobil */}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
