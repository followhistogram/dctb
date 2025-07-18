import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building,
  CreditCard,
  Send,
  Heart,
  Users,
  Calendar,
  MessageCircle,
  FileText,
  Handshake,
} from "lucide-react"

const contactInfo = {
  organization: "DĚLEJ CO TĚ BAVÍ z.ú.",
  address: "Újezd 450/40",
  city: "118 01 Praha 1",
  ico: "03856151",
  dic: "CZ03856151",
  email: "info@delejcotebavi.com",
  phone: "+420 776 369 685",
  account: "269122967/0300",
}

const contactReasons = [
  {
    icon: Users,
    title: "Chci se zapojit jako dobrovolník",
    description: "Máte chuť pomáhat a chcete se stát součástí našeho týmu?",
    color: "from-[#c13aab] to-[#c13aab]/80",
  },
  {
    icon: Calendar,
    title: "Zajímají mě vaše události",
    description: "Chcete se dozvědět více o našich workshopech a táborech?",
    color: "from-[#00acb9] to-[#00acb9]/80",
  },
  {
    icon: Handshake,
    title: "Nabízím spolupráci",
    description: "Představujete školu, organizaci nebo firmu a chcete spolupracovat?",
    color: "from-[#c13aab] to-[#00acb9]",
  },
  {
    icon: MessageCircle,
    title: "Mám dotaz nebo nápad",
    description: "Máte otázku, návrh nebo zpětnou vazbu?",
    color: "from-[#00acb9] to-[#c13aab]",
  },
]

const officeHours = [
  { day: "Pondělí - Pátek", hours: "9:00 - 17:00" },
  { day: "Sobota - Neděle", hours: "Zavřeno" },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#c13aab]/10 to-[#00acb9]/10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge className="bg-[#c13aab]/10 text-[#c13aab] border-[#c13aab]/20 text-base px-4 py-2">Kontakt</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-[#111]">
              Pojďme se{" "}
              <span className="bg-gradient-to-r from-[#c13aab] to-[#00acb9] bg-clip-text text-transparent">spojit</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Máte otázku, nápad nebo se chcete zapojit do našich aktivit? Rádi si s vámi promluvíme. Kontaktujte nás
              jakýmkoliv způsobem, který vám vyhovuje.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Reasons */}
      {/* (Zde můžete doplnit mapování contactReasons, pokud chcete zobrazit) */}

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#111] mb-4">Napište nám</h2>
                <p className="text-lg text-gray-600">
                  Vyplňte formulář a my se vám ozveme co nejdříve. Povinná pole jsou označena hvězdičkou.
                </p>
              </div>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-[#111]">
                          Jméno *
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="Vaše jméno"
                          className="border-gray-300 focus:border-[#c13aab] focus:ring-[#c13aab]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-[#111]">
                          Příjmení *
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Vaše příjmení"
                          className="border-gray-300 focus:border-[#c13aab] focus:ring-[#c13aab]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-[#111]">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="vas@email.cz"
                        className="border-gray-300 focus:border-[#c13aab] focus:ring-[#c13aab]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-[#111]">
                        Telefon
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+420 123 456 789"
                        className="border-gray-300 focus:border-[#c13aab] focus:ring-[#c13aab]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization" className="text-sm font-medium text-[#111]">
                        Organizace/Škola
                      </Label>
                      <Input
                        id="organization"
                        placeholder="Název vaší organizace nebo školy"
                        className="border-gray-300 focus:border-[#c13aab] focus:ring-[#c13aab]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium text-[#111]">
                        Předmět *
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Stručně popište důvod kontaktu"
                        className="border-gray-300 focus:border-[#c13aab] focus:ring-[#c13aab]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium text-[#111]">
                        Zpráva *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Napište nám podrobně, jak vám můžeme pomoci..."
                        className="border-gray-300 focus:border-[#c13aab] focus:ring-[#c13aab] min-h-[120px]"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">
                      <Send className="w-4 h-4 mr-2" />
                      Odeslat zprávu
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Odesláním souhlasíte se zpracováním osobních údajů v souladu s GDPR.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#111] mb-4">Kontaktní údaje</h2>
                <p className="text-lg text-gray-600">
                  Můžete nás kontaktovat přímo nebo se za námi stavit do naší kanceláře v centru Prahy.
                </p>
              </div>

              {/* Organization Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-[#111]">
                    <Building className="w-5 h-5 mr-2 text-[#c13aab]" />
                    Organizace
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-semibold text-[#111] text-lg">{contactInfo.organization}</div>
                    <div className="text-gray-600">Nezisková organizace</div>
                  </div>
                  <Separator />
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-[#111]">IČ</div>
                      <div className="text-gray-600">{contactInfo.ico}</div>
                    </div>
                    <div>
                      <div className="font-medium text-[#111]">DIČ</div>
                      <div className="text-gray-600">{contactInfo.dic}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-[#111]">
                    <Phone className="w-5 h-5 mr-2 text-[#c13aab]" />
                    Přímý kontakt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 text-[#00acb9] mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#111]">Adresa</div>
                      <div className="text-gray-600">
                        {contactInfo.address}
                        <br />
                        {contactInfo.city}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-[#00acb9] flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#111]">Email</div>
                      <a href={`mailto:${contactInfo.email}`} className="text-[#c13aab] hover:underline break-all">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Phone className="w-5 h-5 text-[#00acb9] flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#111]">Telefon</div>
                      <a href={`tel:${contactInfo.phone}`} className="text-[#c13aab] hover:underline">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <CreditCard className="w-5 h-5 text-[#00acb9] flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#111]">Číslo účtu</div>
                      <div className="text-gray-600 font-mono">{contactInfo.account}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-[#111]">
                    <Clock className="w-5 h-5 mr-2 text-[#c13aab]" />
                    Provozní doba
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium text-[#111]">{schedule.day}</span>
                        <span className="text-gray-600">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-[#00acb9]/5 rounded-lg">
                    <p className="text-sm text-[#00acb9]">
                      <strong>Tip:</strong> Před návštěvou doporučujeme telefonicky ověřit, zda budeme v kanceláři
                      přítomni.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-[#c13aab]/5 to-[#00acb9]/5">
                {/* Zde můžete doplnit obsah nebo quick actions */}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111] mb-4">Kde nás najdete</h2>
            <p className="text-lg text-gray-600">Naše kancelář se nachází v centru Prahy na Malé Straně</p>
          </div>

          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 text-[#c13aab] mx-auto" />
                <div>
                  <div className="text-xl font-semibold text-[#111]">Mapa bude zde</div>
                  <div className="text-gray-600">
                    {contactInfo.address}, {contactInfo.city}
                  </div>
                </div>
                <Button className="bg-[#00acb9] hover:bg-[#00acb9]/90 text-white">Otevřít v Google Maps</Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111] mb-4">Často kladené otázky</h2>
            <p className="text-lg text-gray-600">Odpovědi na nejčastější dotazy</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Jak rychle odpovídáte na dotazy?",
                answer:
                  "Snažíme se odpovědět do 24 hodin v pracovní dny. V naléhavých případech nás neváhejte kontaktovat telefonicky.",
              },
              {
                question: "Můžu se k vám stavit bez předchozí domluvy?",
                answer:
                  "Doporučujeme předem zavolat nebo napsat email, abychom si mohli vyhradit dostatek času a zajistili, že budeme v kanceláři přítomni.",
              },
              {
                question: "Nabízíte konzultace online?",
                answer:
                  "Ano, můžeme se domluvit na online schůzce přes videohovor. Stačí nás kontaktovat a domluvíme si vhodný termín.",
              },
              {
                question: "Jak se mohu stát dobrovolníkem?",
                answer:
                  "Napište nám email s krátkým představením a popište, v čem byste nám rádi pomohli. Rádi si s vámi promluvíme o možnostech zapojení.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[#111] mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
