import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ArrowRight, Heart, Star, Quote, CheckCircle } from "lucide-react"
import Image from "next/image"
import { getAllPartners } from "@/lib/partners-actions"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { getLatestNews } from "@/lib/news-data"
import { getLatestEvents } from "@/lib/events-data"

export default async function HomePage() {
  // Fetch data
  const upcomingEvents = await getLatestEvents(2)
  const allPartners = await getAllPartners()
  const activePartners = allPartners.filter((partner) => partner.is_active).slice(0, 6)
  const latestNews = await getLatestNews(3)

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <HeroSection />

        {/* Features Section */}

        {/* Latest News Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nejnovější aktuality</h2>
              <p className="text-xl text-gray-600">Sledujte naše nejnovější zprávy a úspěchy</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.map((article) => (
                <Card
                  key={article.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg flex flex-col"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Link href={`/aktuality/${article.slug}`}>
                      <Image
                        src={article.image_url || "/placeholder.svg?height=250&width=400"}
                        alt={article.title}
                        width={400}
                        height={250}
                        className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold leading-snug">
                      <Link href={`/aktuality/${article.slug}`} className="hover:text-[#c13aab]">
                        {article.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {new Date(article.created_at).toLocaleDateString("cs-CZ", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 line-clamp-3">{article.perex}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" asChild className="p-0 text-[#00acb9] hover:text-[#00acb9]/80">
                      <Link href={`/aktuality/${article.slug}`}>
                        Číst více
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section id="udalosti" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#111] mb-4">Nadcházející události</h2>
              <p className="text-xl text-gray-600">Připojte se k našim workshopům a akcím</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <Badge className="bg-[#00acb9]/10 text-[#00acb9] border-[#00acb9]/20">{event.category}</Badge>
                          <CardTitle className="text-xl text-[#111]">{event.title}</CardTitle>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#c13aab]">{new Date(event.date).getDate()}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString("cs-CZ", { month: "short" }).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-base">{event.description}</CardDescription>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-[#00acb9]" />
                          {new Date(event.date).toLocaleDateString("cs-CZ")} {event.time}
                          {event.end_time && ` - ${event.end_time}`}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-[#00acb9]" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-[#00acb9]" />
                          {event.registered}/{event.capacity} míst obsazeno
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <span className="text-lg font-semibold text-[#111]">
                          {event.price > 0 ? `${event.price} Kč` : "Zdarma"}
                        </span>
                        <Button className="bg-[#00acb9] hover:bg-[#00acb9]/90 text-white" asChild>
                          <Link href={`/udalosti/${event.slug}`}>
                            {event.category === "Tábor" ? "Registrovat se" : "Rezervovat místo"}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-500 text-lg">Momentálně nejsou naplánované žádné nadcházející události.</p>
                  <p className="text-gray-400 mt-2">Sledujte naše stránky pro aktuální informace.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Our Projects - Enhanced */}
        <section
          id="projekty"
          className="py-32 bg-gradient-to-br from-[#111] via-[#111] to-[#222] relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#c13aab] rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00acb9] rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <Badge className="bg-[#c13aab]/20 text-[#c13aab] border-[#c13aab]/30 mb-6 text-base px-4 py-2">
                Naše hlavní projekty
              </Badge>
              <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Měníme životy{" "}
                <span className="bg-gradient-to-r from-[#c13aab] to-[#00acb9] bg-clip-text text-transparent">
                  mladých lidí
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Tři pilíře naší práce, které definují naši identitu a poslání. Každý projekt má svůj jedinečný přístup,
                ale všechny spojuje společný cíl - pomáhat mladým lidem růst a rozvíjet se.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group bg-white/95 backdrop-blur-sm hover:scale-105">
                <CardHeader className="text-center pb-6 pt-8">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-r from-[#c13aab] to-[#c13aab]/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-[#111] mb-4">Za slušnost</CardTitle>
                  
                </CardHeader>
                <CardContent className="text-center px-8 pb-8">
                  <CardDescription className="text-lg mb-8 text-gray-700 leading-relaxed">
                    Manifest za všechny generace. Podporujeme respektfulné chování a vzájemnou úctu v každodenním
                    životě. Věříme, že malé gesta mohou změnit svět.
                  </CardDescription>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-[#c13aab]" />
                      Kampaň pro všechny generace
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-[#c13aab]" />
                      Podpora slušného chování
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white w-full group-hover:shadow-lg transition-all"
                  >
                    Zjistit více o projektu
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group bg-white/95 backdrop-blur-sm hover:scale-105">
                <CardHeader className="text-center pb-6 pt-8">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-r from-[#00acb9] to-[#00acb9]/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-[#111] mb-4">Příměstské tábory</CardTitle>
                  
                </CardHeader>
                <CardContent className="text-center px-8 pb-8">
                  <CardDescription className="text-lg mb-8 text-gray-700 leading-relaxed">
                    Bikecamp a Táboráček nabízejí dětem smysluplně strávený čas, bezpečné prostředí a nezapomenutelné
                    zážitky pod vedením zkušených lektorů. Více než jen tábor - životní zkušenost.
                  </CardDescription>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-[#00acb9]" />
                      Pro děti 8-16 let
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-[#00acb9]" />
                      Zkušení instruktoři
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-[#00acb9] hover:bg-[#00acb9]/90 text-white w-full group-hover:shadow-lg transition-all"
                  >
                    Prohlédnout tábory
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group bg-white/95 backdrop-blur-sm hover:scale-105">
                <CardHeader className="text-center pb-6 pt-8">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-r from-[#f5a623] to-[#f5a623]/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Star className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-[#111] mb-4">Rada mladších</CardTitle>
                  
                </CardHeader>
                <CardContent className="text-center px-8 pb-8">
                  <CardDescription className="text-lg mb-8 text-gray-700 leading-relaxed">
                    Meziškolní konference středoškolské mládeže na aktuální společenská témata. Prostor pro diskusi a
                    výměnu názorů mladých lidí. Hlas mladé generace má sílu.
                  </CardDescription>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-[#f5a623]" />
                      Středoškolští studenti
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-[#f5a623]" />
                      Aktuální témata
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-[#f5a623] hover:bg-[#f5a623]/90 text-white w-full group-hover:shadow-lg transition-all"
                  >
                    Více o konferenci
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Additional impact section */}
            <div className="mt-20 text-center">
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#c13aab] mb-2">1000+</div>
                  <div className="text-gray-300">Ovlivněných životů</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#00acb9] mb-2">50+</div>
                  <div className="text-gray-300">Partnerských škol</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">10</div>
                  <div className="text-gray-300">Let zkušeností</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-br from-[#c13aab]/5 to-[#00acb9]/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#111] mb-4">Co o nás říkají</h2>
              <p className="text-xl text-gray-600">Reference od našich účastníků</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-[#c13aab] mb-4" />
                    <p className="text-gray-700 mb-4">
                      "Díky organizaci Dělej co tě baví jsem našel svou vášeň pro fotografii a dnes pracuji jako
                      profesionální fotograf."
                    </p>
                    <div className="flex items-center">
                      <Image
                        src={`/placeholder.svg?height=40&width=40&query=young person portrait ${i}`}
                        alt={`Účastník ${i}`}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                      />
                      <div>
                        <div className="font-semibold text-[#111]">Jan Novák</div>
                        <div className="text-sm text-gray-600">Účastník programu</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section id="partneri" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#111] mb-4">Naši partneři</h2>
              <p className="text-xl text-gray-600">Společně vytváříme lepší budoucnost</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {activePartners.length > 0 ? (
                activePartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all"
                  >
                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full flex items-center justify-center"
                      >
                        {partner.logo_url ? (
                          <Image
                            src={partner.logo_url || "/placeholder.svg"}
                            alt={partner.name}
                            width={120}
                            height={60}
                            className="max-w-full h-auto object-contain"
                          />
                        ) : (
                          <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center text-gray-600 text-sm font-medium">
                            {partner.name}
                          </div>
                        )}
                      </a>
                    ) : (
                      <>
                        {partner.logo_url ? (
                          <Image
                            src={partner.logo_url || "/placeholder.svg"}
                            alt={partner.name}
                            width={120}
                            height={60}
                            className="max-w-full h-auto object-contain"
                          />
                        ) : (
                          <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center text-gray-600 text-sm font-medium">
                            {partner.name}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Momentálně nejsou k dispozici žádní partneři.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#c13aab] to-[#00acb9]">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">Připojte se k naší komunitě</h2>
              <p className="text-xl text-white/90">
                Staňte se součástí organizace, která pomáhá mladým lidem realizovat jejich sny a najít svou cestu v
                životě.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-[#c13aab] hover:bg-white/90">
                  Staňte se dobrovolníkem
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#c13aab] bg-transparent"
                >
                  Kontaktujte nás
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
