import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, Users, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-server"

export default async function EventsPage() {
  const { data: events, error } = await supabaseAdmin.from("events").select("*").order("date", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
  }

  const allEvents = events || []
  const featuredEvents = allEvents.filter((event) => event.featured)
  const upcomingEvents = allEvents.filter((event) => new Date(event.date) >= new Date())
  const categories = [...new Set(allEvents.map((event) => event.category))]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#111] mb-6">Naše události</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Objevte workshopy, semináře a tábory, které vás posunou vpřed. Učte se od odborníků a rozvíjejte své
            dovednosti v přátelském prostředí.
          </p>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#111] mb-8">Doporučené události</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Link href={`/udalosti/${event.slug}`}>
                      <Image
                        src={event.image_url || "/placeholder.svg?height=300&width=600&query=featured event"}
                        alt={event.title}
                        width={600}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </Link>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#c13aab] text-white">{event.category}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-[#00acb9] text-white">Doporučeno</Badge>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <Link href={`/udalosti/${event.slug}`}>
                        <h3 className="text-2xl font-bold text-[#111] group-hover:text-[#c13aab] transition-colors cursor-pointer">
                          {event.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 line-clamp-3">{event.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-[#00acb9]" />
                          {new Date(event.date).toLocaleDateString("cs-CZ")}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-[#00acb9]" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-[#00acb9]" />
                          {event.organizer}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-[#00acb9]" />
                          {event.registered}/{event.capacity}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-2xl font-bold text-[#111]">
                          {event.price === 0 ? "Zdarma" : `${event.price} Kč`}
                        </span>
                        <Link href={`/udalosti/${event.slug}`}>
                          <Button className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">
                            Více informací
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Events */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#111]">Všechny události</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="outline" className="border-[#00acb9] text-[#00acb9]">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Link href={`/udalosti/${event.slug}`}>
                    <Image
                      src={event.image_url || "/placeholder.svg?height=200&width=400&query=event"}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </Link>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#00acb9] text-white">{event.category}</Badge>
                  </div>
                  {event.registered >= event.capacity && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive">Obsazeno</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Link href={`/udalosti/${event.slug}`}>
                      <h3 className="text-xl font-bold text-[#111] group-hover:text-[#c13aab] transition-colors line-clamp-2 cursor-pointer">
                        {event.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-[#00acb9]" />
                        {new Date(event.date).toLocaleDateString("cs-CZ")}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-[#00acb9]" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-[#00acb9]" />
                        {event.registered}/{event.capacity} účastníků
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-lg font-bold text-[#111]">
                        {event.price === 0 ? "Zdarma" : `${event.price} Kč`}
                      </span>
                      <Link href={`/udalosti/${event.slug}`}>
                        <Button size="sm" className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">
                          Detail
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#00acb9] to-[#c13aab] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Nenašli jste to, co hledáte?</h2>
          <p className="text-xl mb-8 opacity-90">
            Kontaktujte nás a společně vytvoříme událost přesně podle vašich potřeb.
          </p>
          <Link href="/kontakt">
            <Button size="lg" className="bg-white text-[#111] hover:bg-gray-100">
              Kontaktujte nás
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
