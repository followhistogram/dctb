import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Heart, Users, Building, Globe, Award, Handshake } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getPartnersByCategory, getPartnerCategories } from "@/lib/partners-actions"

const categoryIcons = {
  educational: Users,
  municipal: Building,
  corporate: Handshake,
  media: Globe,
}

const stats = [
  { number: "50+", label: "Aktivních partnerů", icon: Handshake },
  { number: "15", label: "Měst a obcí", icon: Building },
  { number: "25+", label: "Vzdělávacích institucí", icon: Users },
  { number: "10", label: "Let spolupráce", icon: Award },
]

export default async function PartnersPage() {
  const [partnersByCategory, categories] = await Promise.all([getPartnersByCategory(), getPartnerCategories()])

  // Filter only active partners
  const activePartnersByCategory = Object.entries(partnersByCategory).reduce(
    (acc, [categoryId, partners]) => {
      acc[categoryId] = partners.filter((partner) => partner.is_active)
      return acc
    },
    {} as Record<string, any[]>,
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#c13aab]/10 to-[#00acb9]/10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge className="bg-[#c13aab]/10 text-[#c13aab] border-[#c13aab]/20 text-base px-4 py-2">
              Naši partneři
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-[#111]">
              Společně{" "}
              <span className="bg-gradient-to-r from-[#c13aab] to-[#00acb9] bg-clip-text text-transparent">
                vytváříme
              </span>{" "}
              budoucnost
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Naše práce by nebyla možná bez podpory skvělých partnerů. Děkujeme všem organizacím, školám, městům a
              firmám, které s námi sdílejí vizi lepší budoucnosti pro mladé lidi.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      

      {/* Partners by Category */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {categories.map((category) => {
            const categoryPartners = activePartnersByCategory[category.id] || []
            if (categoryPartners.length === 0) return null

            const CategoryIcon = categoryIcons[category.id as keyof typeof categoryIcons] || Building

            return (
              <div key={category.id} className="mb-20">
                <div className="flex items-center mb-12">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mr-4`}
                  >
                    <CategoryIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#111]">{category.title}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryPartners.map((partner) => (
                    <Card
                      key={partner.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                    >
                      <CardContent className="p-0">
                        {partner.website ? (
                          <Link
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-full"
                          >
                            <PartnerCard partner={partner} />
                          </Link>
                        ) : (
                          <PartnerCard partner={partner} />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Partnership Benefits */}
      

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#c13aab] to-[#00acb9]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">Staňte se naším partnerem</h2>
            <p className="text-xl text-white/90">
              Máte zájem o spolupráci? Rádi si s vámi promluvíme o možnostech partnerství a najdeme způsob, jak můžeme
              spolupracovat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kontakt">
                <Button size="lg" className="bg-white text-[#c13aab] hover:bg-white/90">
                  Kontaktujte nás
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/projekty">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#c13aab] bg-transparent"
                >
                  Prohlédnout projekty
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function PartnerCard({ partner }: { partner: any }) {
  return (
    <>
      {/* Logo Section */}
      <div className="bg-gray-50 p-8 flex items-center justify-center h-32 group-hover:bg-gray-100 transition-colors">
        {partner.logo_url ? (
          <Image
            src={partner.logo_url || "/placeholder.svg"}
            alt={`${partner.name} logo`}
            width={200}
            height={80}
            className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">
            <Building className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-[#111] group-hover:text-[#c13aab] transition-colors leading-tight">
            {partner.name}
          </h3>
          {partner.website && (
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#c13aab] transition-colors flex-shrink-0 ml-2" />
          )}
        </div>
        {partner.description && <p className="text-sm text-gray-600 leading-relaxed">{partner.description}</p>}
      </div>
    </>
  )
}
