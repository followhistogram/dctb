import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#111] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Zůstaňte v kontaktu</h3>
            <p className="text-gray-400 mb-6">
              Přihlaste se k odběru našeho newsletteru a nezmeškejte žádnou novinku ani událost.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Váš email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-[#c13aab]"
              />
              <Button className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white whitespace-nowrap">Přihlásit se</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#c13aab] to-[#00acb9] rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Dělej co tě baví</h2>
                <p className="text-xs text-gray-400">Nezisková organizace</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pomáháme mladým lidem najít svou cestu, rozvíjet talenty a realizovat své sny. Připojte se k naší komunitě
              a objevte nové možnosti.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#c13aab] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#c13aab] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#c13aab] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#c13aab] transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Rychlé odkazy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/o-nas" className="text-gray-400 hover:text-[#c13aab] transition-colors text-sm">
                  O nás
                </Link>
              </li>
              <li>
                <Link href="/projekty" className="text-gray-400 hover:text-[#c13aab] transition-colors text-sm">
                  Naše projekty
                </Link>
              </li>
              <li>
                <Link href="/udalosti" className="text-gray-400 hover:text-[#c13aab] transition-colors text-sm">
                  Události
                </Link>
              </li>
              <li>
                <Link href="/aktuality" className="text-gray-400 hover:text-[#c13aab] transition-colors text-sm">
                  Aktuality
                </Link>
              </li>
              <li>
                <Link href="/reference" className="text-gray-400 hover:text-[#c13aab] transition-colors text-sm">
                  Reference
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-400 hover:text-[#c13aab] transition-colors text-sm">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* For Media */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Pro média</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pro-media" className="text-gray-400 hover:text-[#c13aab] transition-colors text-sm">
                  Tiskové zprávy
                </Link>
              </li>
              <li>
                <Link href="/vyrocni-zpravy" className="text-gray-400 hover:text-[#c13aab] transition-colors text-sm">
                  Výroční zprávy
                </Link>
              </li>
              <li>
                <Link href="/fotogalerie" className="text-gray-400 hover:text-[#c13aab] transition-colors text-sm">
                  Fotogalerie
                </Link>
              </li>
              <li>
                <Link href="/ke-stazeni" className="text-gray-400 hover:text-[#c13aab] transition-colors text-sm">
                  Ke stažení
                </Link>
              </li>
              <li>
                <Link href="/partneri" className="text-gray-400 hover:text-[#c13aab] transition-colors text-sm">
                  Partneři
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Kontakt</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#c13aab] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <div>Náměstí Míru 15</div>
                  <div>120 00 Praha 2</div>
                  <div>Česká republika</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#c13aab] flex-shrink-0" />
                <Link
                  href="mailto:info@delejcotebavi.com"
                  className="text-sm text-gray-400 hover:text-[#c13aab] transition-colors"
                >
                  info@delejcotebavi.com
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#c13aab] flex-shrink-0" />
                <Link href="tel:+420123456789" className="text-sm text-gray-400 hover:text-[#c13aab] transition-colors">
                  +420 123 456 789
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-white mb-2 text-sm">Provozní doba</h4>
              <div className="text-sm text-gray-400">
                <div>Po - Pá: 9:00 - 17:00</div>
                <div>So - Ne: Zavřeno</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">&copy; 2024 Dělej co tě baví, z.s. Všechna práva vyhrazena.</div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/ochrana-udaju" className="text-gray-400 hover:text-[#c13aab] transition-colors">
                Ochrana údajů
              </Link>
              <Link href="/obchodni-podminky" className="text-gray-400 hover:text-[#c13aab] transition-colors">
                Obchodní podmínky
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-[#c13aab] transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
