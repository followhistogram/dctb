import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  MapPin,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Bike,
  Shield,
  Users,
  Star,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CampRegistrationForm } from "@/components/camp-registration-form"

const bikeCampEvent = {
  id: "bike-camp-2025",
  title: "Příměstský tábor BIKE CAMP",
  description: "Týdenní dobrodružství na kolech pro děti a mládež ve věku 8-16 let.",
  longDescription:
    "Příměstský tábor BIKE CAMP je určen pro všechny mladé cyklisty, kteří chtějí zlepšit své dovednosti na kole a prožít nezapomenutelné prázdniny. Během pěti dnů se naučíte základy bezpečné jízdy, zvládnete technické prvky a projdete se po nejkrásnějších stezkách v okolí Prahy. Tábor je veden zkušenými instruktory a je vhodný jak pro začátečníky, tak pro pokročilé.",
  date: "2025-08-11",
  endDate: "2025-08-15",
  time: "08:00",
  endTime: "16:00",
  location: "Bike park Letná",
  address: "Letenské sady, Praha 7",
  capacity: 24,
  registered: 18,
  price: 4900,
  category: "Tábor",
  image: "/placeholder.svg?height=400&width=600",
  organizer: "Tomáš Novotný",
  requirements: [
    "Vlastní kolo v dobrém technickém stavu",
    "Cyklistická helma (povinná)",
    "Sportovní oblečení a obuv",
    "Pláštěnka nebo nepromokavá bunda",
    "Láhev na pití",
    "Svačina na každý den",
  ],
  agenda: [
    { time: "08:00-08:30", activity: "Příchod a ranní rozcvička" },
    { time: "08:30-10:00", activity: "Technické dovednosti - brždění a zatáčení" },
    { time: "10:00-10:15", activity: "Přestávka" },
    { time: "10:15-11:45", activity: "Jízda v terénu - základy" },
    { time: "11:45-12:30", activity: "Oběd" },
    { time: "12:30-14:00", activity: "Výlet na kolech po okolí" },
    { time: "14:00-14:15", activity: "Svačina" },
    { time: "14:15-15:30", activity: "Hry a soutěže na kolech" },
    { time: "15:30-16:00", activity: "Závěrečné hodnocení dne" },
  ],
  tags: ["cyklistika", "tábor", "děti", "sport", "příroda"],
  featured: true,
}

export default function BikeCampDetailPage() {
  const isFullyBooked = bikeCampEvent.registered >= bikeCampEvent.capacity
  const availableSpots = bikeCampEvent.capacity - bikeCampEvent.registered
  const occupancyPercentage = (bikeCampEvent.registered / bikeCampEvent.capacity) * 100

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/udalosti">
            <Button variant="ghost" className="text-[#c13aab] hover:text-[#c13aab]/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zpět na události
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src={bikeCampEvent.image || "/placeholder.svg"}
                alt={bikeCampEvent.title}
                width={800}
                height={400}
                className="w-full h-64 lg:h-96 object-cover"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <Badge className="bg-[#c13aab] text-white text-base px-3 py-1">{bikeCampEvent.category}</Badge>
                <Badge className="bg-[#00acb9] text-white text-base px-3 py-1">Doporučeno</Badge>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-1">BIKE CAMP 2025</h2>
                      <p className="text-sm opacity-90">Pro děti 8-16 let • 5 dní plných dobrodružství</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">4 900 Kč</div>
                      <div className="text-sm opacity-90">včetně oběda</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-[#111] mb-4">{bikeCampEvent.title}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">{bikeCampEvent.longDescription}</p>
              </div>

              {/* Highlights */}
              

              {/* Key Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-[#111]">
                      <Calendar className="w-5 h-5 mr-2 text-[#c13aab]" />
                      Datum a čas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-lg font-semibold">11. srpna - 15. srpna 2025</div>
                      <div className="text-gray-600">5 dní (Pondělí - Pátek)</div>
                      <div className="text-gray-600">
                        Denně {bikeCampEvent.time} - {bikeCampEvent.endTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-[#111]">
                      <MapPin className="w-5 h-5 mr-2 text-[#c13aab]" />
                      Místo konání
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-lg font-semibold">{bikeCampEvent.location}</div>
                      <div className="text-gray-600">{bikeCampEvent.address}</div>
                      <div className="text-sm text-[#00acb9]">📍 Snadná dostupnost MHD • Parkování pro rodiče</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Organizer */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-[#111]">
                    <User className="w-5 h-5 mr-2 text-[#c13aab]" />
                    Hlavní instruktor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt={bikeCampEvent.organizer}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-[#111]">{bikeCampEvent.organizer}</div>
                      <div className="text-gray-600 mb-2">Certifikovaný cyklistický instruktor</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        10+ let zkušeností • 500+ spokojených dětí
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-[#111]">
                    <CheckCircle className="w-5 h-5 mr-2 text-[#c13aab]" />
                    Co si přinést
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {bikeCampEvent.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 text-[#00acb9] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Důležité:</strong> Kolo musí být v dobrém technickém stavu. Před táborem doporučujeme
                      kontrolu v servisu.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Program */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-[#111]">
                    <Clock className="w-5 h-5 mr-2 text-[#c13aab]" />
                    Denní program
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bikeCampEvent.agenda.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="bg-[#00acb9]/10 text-[#00acb9] px-3 py-1 rounded-lg text-sm font-medium min-w-fit">
                          {item.time}
                        </div>
                        <div className="text-gray-700 flex-1">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-[#c13aab]/5 rounded-lg">
                    <p className="text-sm text-[#c13aab]">
                      <strong>Poznámka:</strong> Program se může mírně lišit podle počasí a pokroku skupiny.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[#111]">V ceně tábora</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-gray-700">Odborné vedení instruktory</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-gray-700">Oběd každý den</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-gray-700">Pitný režim</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-gray-700">Základní opravy kol</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-gray-700">Certifikát o absolvování</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-gray-700">Pojištění účastníků</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {bikeCampEvent.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Registration */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl sticky top-8">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-[#111]">4 900 Kč</CardTitle>
                  {isFullyBooked ? (
                    <Badge variant="destructive">Obsazeno</Badge>
                  ) : availableSpots <= 3 ? (
                    <Badge className="bg-orange-100 text-orange-800">Posledních {availableSpots} míst</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">Dostupné</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">Záloha 1 500 Kč • Doplatek do 1. 8. 2025</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Capacity Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Obsazenost</span>
                    <span className="font-medium text-[#111]">
                      {bikeCampEvent.registered}/{bikeCampEvent.capacity} míst
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#00acb9] to-[#c13aab] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFullyBooked ? (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Tábor je plně obsazen
                      </div>
                    ) : (
                      `Zbývá ${availableSpots} ${availableSpots === 1 ? "místo" : availableSpots < 5 ? "místa" : "míst"}`
                    )}
                  </div>
                </div>

                <Separator />

                {/* Registration Form */}
                {!isFullyBooked ? (
                  <CampRegistrationForm event={bikeCampEvent} />
                ) : (
                  <div className="text-center py-6">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-[#111] mb-2">Tábor je obsazen</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Všechna místa jsou již rezervována. Můžete se přihlásit na čekací listinu.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-[#c13aab] text-[#c13aab] hover:bg-[#c13aab] hover:text-white bg-transparent"
                    >
                      Přihlásit na čekací listinu
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-[#111]">Máte otázky?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-[#111]">Email</div>
                    <div className="text-gray-600">tabory@delejcotebavi.com</div>
                  </div>
                  <div>
                    <div className="font-medium text-[#111]">Telefon</div>
                    <div className="text-gray-600">+420 123 456 789</div>
                  </div>
                  <div>
                    <div className="font-medium text-[#111]">Provozní doba</div>
                    <div className="text-gray-600">Po-Pá 9:00-17:00</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Info */}
            <Card className="border-0 shadow-lg bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">Bezpečnost</h4>
                    <p className="text-sm text-green-700">
                      Všichni instruktoři mají platný certifikát první pomoci. Tábor je pojištěn.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
