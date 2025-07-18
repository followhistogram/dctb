import { getEvents, deleteEvent } from "@/lib/events-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"

export default async function AdminEventsPage() {
  const events = await getEvents()

  const handleDelete = async (eventId: string) => {
    "use server"
    await deleteEvent(eventId)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Správa událostí</h1>
        <Link href="/admin/udalosti/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nová událost
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Všechny události ({events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Žádné události</h3>
              <p className="text-gray-600 mb-4">Začněte vytvořením první události.</p>
              <Link href="/admin/udalosti/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Vytvořit událost
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Název</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Místo</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Typ formuláře</TableHead>
                  <TableHead>Kapacita</TableHead>
                  <TableHead>Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{event.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {new Date(event.date).toLocaleDateString("cs-CZ")}
                      </div>
                      {event.time && <div className="text-sm text-muted-foreground">{event.time}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        {event.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={event.form_type === "camp" ? "default" : "secondary"}>
                        {event.form_type === "camp" ? "Tábor" : "Událost"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        {event.registered || 0}/{event.capacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/udalosti/${event.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <form action={handleDelete.bind(null, event.id)}>
                          <Button variant="outline" size="sm" type="submit">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
