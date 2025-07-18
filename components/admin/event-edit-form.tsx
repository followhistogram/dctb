"use client"

import { updateEvent, getRegistrationsForEvent } from "@/lib/events-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { exportRegistrationsToCSV } from "@/lib/csv-export"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EventEditFormProps {
  event: any
}

export default function EventEditForm({ event }: EventEditFormProps) {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRegistration, setExpandedRegistration] = useState<string | null>(null)

  useEffect(() => {
    async function loadRegistrations() {
      try {
        const data = await getRegistrationsForEvent(event.id)
        setRegistrations(data)
      } catch (error) {
        console.error("Error loading registrations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRegistrations()
  }, [event.id])

  const handleExport = () => {
    exportRegistrationsToCSV(registrations, event.title)
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Upravit událost</TabsTrigger>
          <TabsTrigger value="registrations">Registrace ({registrations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upravit událost</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateEvent.bind(null, event.id)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Název události *</Label>
                    <Input id="title" name="title" defaultValue={event.title} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategorie *</Label>
                    <Select name="category" defaultValue={event.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="camp">Tábor</SelectItem>
                        <SelectItem value="course">Kurz</SelectItem>
                        <SelectItem value="event">Událost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Krátký popis *</Label>
                  <Textarea id="description" name="description" defaultValue={event.description} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Dlouhý popis</Label>
                  <Textarea
                    id="longDescription"
                    name="longDescription"
                    defaultValue={event.long_description || ""}
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Datum začátku *</Label>
                    <Input id="date" name="date" type="date" defaultValue={event.date} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Datum konce</Label>
                    <Input id="endDate" name="endDate" type="date" defaultValue={event.end_date || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="time">Čas začátku</Label>
                    <Input id="time" name="time" type="time" defaultValue={event.time || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Čas konce</Label>
                    <Input id="endTime" name="endTime" type="time" defaultValue={event.end_time || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Místo konání *</Label>
                    <Input id="location" name="location" defaultValue={event.location} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresa</Label>
                    <Input id="address" name="address" defaultValue={event.address || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Kapacita *</Label>
                    <Input id="capacity" name="capacity" type="number" min="1" defaultValue={event.capacity} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Cena (Kč)</Label>
                    <Input id="price" name="price" type="number" min="0" step="0.01" defaultValue={event.price} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizer">Organizátor</Label>
                    <Input id="organizer" name="organizer" defaultValue={event.organizer || ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL obrázku</Label>
                  <Input id="imageUrl" name="imageUrl" type="url" defaultValue={event.image_url || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form_type">Typ formuláře *</Label>
                  <Select name="form_type" defaultValue={event.form_type || "event"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Jednoduchá registrace</SelectItem>
                      <SelectItem value="camp">Detailní registrace (tábor)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Požadavky (jeden na řádek)</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    rows={4}
                    defaultValue={event.requirements?.join("\n") || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tagy (oddělené čárkami)</Label>
                  <Input id="tags" name="tags" defaultValue={event.tags?.join(", ") || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agenda">Program (formát: čas - aktivita, jeden na řádek)</Label>
                  <Textarea
                    id="agenda"
                    name="agenda"
                    rows={6}
                    defaultValue={event.agenda?.map((item: any) => `${item.time} - ${item.activity}`).join("\n") || ""}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" name="featured" defaultChecked={event.featured} />
                  <Label htmlFor="featured">Doporučená událost</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Uložit změny</Button>
                  <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Zrušit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Registrace</h2>
                <p className="text-muted-foreground">
                  Celkem registrací: {registrations.length} / {event.capacity}
                </p>
              </div>
              {registrations.length > 0 && (
                <Button onClick={handleExport} variant="outline">
                  Export CSV
                </Button>
              )}
            </div>

            {loading ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">Načítání registrací...</p>
                </CardContent>
              </Card>
            ) : registrations.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">Zatím se nikdo neregistroval</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {registrations.map((registration, index) => (
                  <Card key={registration.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {registration.full_name || `${registration.first_name} ${registration.last_name}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">{registration.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={registration.registration_type === "camp" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {registration.registration_type === "camp" ? "Tábor" : "Událost"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedRegistration(expandedRegistration === registration.id ? null : registration.id)
                            }
                          >
                            {expandedRegistration === registration.id ? "Skrýt" : "Detail"}
                          </Button>
                        </div>
                      </div>

                      {expandedRegistration === registration.id && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium">Email:</span> {registration.email}
                            </div>
                            {registration.phone && (
                              <div>
                                <span className="font-medium">Telefon:</span> {registration.phone}
                              </div>
                            )}
                            {registration.age && (
                              <div>
                                <span className="font-medium">Věk:</span> {registration.age}
                              </div>
                            )}
                            {registration.emergency_contact && (
                              <div>
                                <span className="font-medium">Nouzový kontakt:</span> {registration.emergency_contact}
                              </div>
                            )}
                            {registration.dietary_restrictions && (
                              <div>
                                <span className="font-medium">Dietní omezení:</span> {registration.dietary_restrictions}
                              </div>
                            )}
                            {registration.medical_conditions && (
                              <div>
                                <span className="font-medium">Zdravotní omezení:</span>{" "}
                                {registration.medical_conditions}
                              </div>
                            )}
                            {registration.swimming_ability && (
                              <div>
                                <span className="font-medium">Plavecké dovednosti:</span>{" "}
                                {registration.swimming_ability}
                              </div>
                            )}
                            {registration.parent_name && (
                              <div>
                                <span className="font-medium">Jméno rodiče:</span> {registration.parent_name}
                              </div>
                            )}
                            {registration.parent_phone && (
                              <div>
                                <span className="font-medium">Telefon rodiče:</span> {registration.parent_phone}
                              </div>
                            )}
                            {registration.parent_email && (
                              <div>
                                <span className="font-medium">Email rodiče:</span> {registration.parent_email}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Registrováno:</span>{" "}
                              {new Date(registration.created_at).toLocaleDateString("cs-CZ", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>

                          {registration.message && (
                            <div className="p-3 bg-muted rounded-lg">
                              <span className="font-medium text-sm">Zpráva:</span>
                              <p className="mt-1 text-sm">{registration.message}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
