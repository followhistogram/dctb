import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Quote, Star, Users, Award, Heart, CheckCircle } from "lucide-react"
import Image from "next/image"
import { getActiveTestimonials } from "@/lib/testimonials-actions"

const stats = [
  { number: "98%", label: "Spokojených účastníků", icon: Heart },
  { number: "150+", label: "Pozitivních referencí", icon: Star },
  { number: "50+", label: "Partnerských škol", icon: Users },
  { number: "10", label: "Let zkušeností", icon: Award },
]

export default async function ReferencePage() {
  let testimonials = []

  try {
    testimonials = await getActiveTestimonials()
  } catch (error) {
    console.error("Error loading testimonials:", error)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#c13aab]/10 to-[#00acb9]/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <Badge className="bg-[#c13aab]/10 text-[#c13aab] border-[#c13aab]/20 mb-4">Reference</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#111]">Co o nás říkají</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Zpětná vazba od našich klientů, partnerů a účastníků je pro nás nejdůležitější. Přečtěte si, co říkají o
              naší práci a výsledcích našich projektů.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111] mb-4">Ohlasy našich klientů</h2>
            <p className="text-xl text-gray-600">Autentické zpětné vazby od škol, rodičů a účastníků našich programů</p>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <Quote className="w-8 h-8 text-[#c13aab] flex-shrink-0" />
                      <div className="flex items-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        {testimonial.photo_url ? (
                          <Image
                            src={testimonial.photo_url || "/placeholder.svg"}
                            alt={testimonial.name}
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-[#c13aab] to-[#00acb9] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium text-sm">
                              {testimonial.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-[#111]">{testimonial.name}</div>
                          <div className="text-sm text-gray-600">{testimonial.position}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Zatím nejsou k dispozici žádné reference.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111] mb-4">Kdo nás doporučuje</h2>
            <p className="text-xl text-gray-600">Spolupracujeme s různými typy institucí a organizací</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#c13aab]/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#c13aab]" />
                </div>
                <h3 className="font-semibold text-[#111] mb-2">Střední školy</h3>
                <p className="text-sm text-gray-600">Spolupráce s více než 50 středními školami po celé ČR</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#00acb9]/10 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#00acb9]" />
                </div>
                <h3 className="font-semibold text-[#111] mb-2">Rodiče</h3>
                <p className="text-sm text-gray-600">Důvěra rodičů v kvalitu našich táborů a programů</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#c13aab]/10 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#c13aab]" />
                </div>
                <h3 className="font-semibold text-[#111] mb-2">Partneři</h3>
                <p className="text-sm text-gray-600">Dlouhodobá spolupráce s městy a kulturními institucemi</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#00acb9]/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#00acb9]" />
                </div>
                <h3 className="font-semibold text-[#111] mb-2">Účastníci</h3>
                <p className="text-sm text-gray-600">Pozitivní zpětná vazba od mladých lidí všech věkových kategorií</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#c13aab] to-[#00acb9]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Chcete se stát součástí našich referencí?</h2>
            <p className="text-xl text-white/90">
              Připojte se k našim spokojených klientům a partnerům. Kontaktujte nás a domluvme si spolupráci.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/kontakt"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#c13aab] font-medium rounded-lg hover:bg-white/90 transition-colors"
              >
                Kontaktujte nás
              </a>
              <a
                href="/udalosti"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-[#c13aab] transition-colors"
              >
                Prohlédnout události
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
