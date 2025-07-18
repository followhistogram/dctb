import { createEvent } from "@/lib/events-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewEventPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/udalosti">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nová událost</h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Vytvořit novou událost</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createEvent} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Název události *</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategorie *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte kategorii" />
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
              <Textarea id="description" name="description" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Dlouhý popis</Label>
              <Textarea id="longDescription" name="longDescription" rows={6} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Datum začátku *</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Datum konce</Label>
                <Input id="endDate" name="endDate" type="date" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="time">Čas začátku</Label>
                <Input id="time" name="time" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Čas konce</Label>
                <Input id="endTime" name="endTime" type="time" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Místo konání *</Label>
                <Input id="location" name="location" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresa</Label>
                <Input id="address" name="address" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capacity">Kapacita *</Label>
                <Input id="capacity" name="capacity" type="number" min="1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Cena (Kč)</Label>
                <Input id="price" name="price" type="number" min="0" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizátor</Label>
                <Input id="organizer" name="organizer" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL obrázku</Label>
              <Input id="imageUrl" name="imageUrl" type="url" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="formType">Typ formuláře *</Label>
              <Select name="formType" defaultValue="event" required>
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
              <Textarea id="requirements" name="requirements" rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tagy (oddělené čárkami)</Label>
              <Input id="tags" name="tags" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agenda">Program (formát: čas - aktivita, jeden na řádek)</Label>
              <Textarea id="agenda" name="agenda" rows={6} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="featured" name="featured" />
              <Label htmlFor="featured">Doporučená událost</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit">Vytvořit událost</Button>
              <Link href="/admin/udalosti">
                <Button type="button" variant="outline">
                  Zrušit
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
