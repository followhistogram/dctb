import { getEventBySlug } from "@/lib/events-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, User } from "lucide-react"
import { notFound } from "next/navigation"
import { CampRegistrationForm } from "@/components/camp-registration-form"
import { ReservationForm } from "@/components/reservation-form"

interface EventPageProps {
  params: {
    slug: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventBySlug(params.slug)

  if (!event) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("cs-CZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  return (
    <div className="container mx-auto py-8">
      {/* Hero Image */}
      {event.image_url && (
        <div className="relative w-full h-64 md:h-80 lg:h-96 mb-8 rounded-lg overflow-hidden">
          <img src={event.image_url || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {event.category}
                </Badge>
                {event.featured && (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Doporučeno
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={event.form_type === "camp" ? "bg-blue-600 text-white" : "bg-white/20 text-white"}
                >
                  {event.form_type === "camp" ? "Tábor" : "Událost"}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              <p className="text-lg opacity-90">{event.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header - only show if no image */}
          {!event.image_url && (
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{event.category}</Badge>
                {event.featured && <Badge>Doporučeno</Badge>}
                <Badge variant={event.form_type === "camp" ? "default" : "secondary"}>
                  {event.form_type === "camp" ? "Tábor" : "Událost"}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-xl text-muted-foreground">{event.description}</p>
            </div>
          )}

          {/* Event Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{formatDate(event.date)}</div>
                    {event.end_date && event.end_date !== event.date && (
                      <div className="text-sm text-muted-foreground">do {formatDate(event.end_date)}</div>
                    )}
                  </div>
                </div>

                {(event.time || event.end_time) && (
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {event.time && formatTime(event.time)}
                        {event.end_time && ` - ${formatTime(event.end_time)}`}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{event.location}</div>
                    {event.address && <div className="text-sm text-muted-foreground">{event.address}</div>}
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {event.registered || 0} / {event.capacity} účastníků
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.capacity - (event.registered || 0)} volných míst
                    </div>
                  </div>
                </div>

                {event.price > 0 && (
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-muted-foreground">Kč</span>
                    </div>
                    <div>
                      <div className="font-medium">{event.price} Kč</div>
                      <div className="text-sm text-muted-foreground">za osobu</div>
                    </div>
                  </div>
                )}

                {event.organizer && (
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{event.organizer}</div>
                      <div className="text-sm text-muted-foreground">organizátor</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Long Description */}
          {event.long_description && (
            <Card>
              <CardHeader>
                <CardTitle>Popis události</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {event.long_description.split("\n").map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {event.requirements && event.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Požadavky</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {event.requirements.map((requirement: string, index: number) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.agenda.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-md min-w-[80px] text-center flex-shrink-0">
                        {item.time}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="font-medium text-gray-900">{item.activity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Registration Form */}
        <div>
          {event.form_type === "camp" ? <CampRegistrationForm event={event} /> : <ReservationForm event={event} />}
        </div>
      </div>
    </div>
  )
}
