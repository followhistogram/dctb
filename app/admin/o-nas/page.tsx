import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { addTeamMember, deleteTeamMember, updateAboutUsContent, updateTeamMember } from "@/lib/about-us-actions"
import { Pencil, PlusCircle, Trash2, AlertCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Správa stránky O nás | Admin",
  description: "Správa obsahu stránky O nás a členů týmu",
}

interface TeamMember {
  id: string
  name: string
  position: string
  email: string | null
  image_url: string | null
  display_order: number
}

interface AboutUsContent {
  id: string
  title: string
  content: string
  updated_at: string
}

export default async function AdminAboutUsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Načtení obsahu stránky O nás
  const { data: contentData, error: contentError } = await supabase.from("about_us_content").select("*").single()

  // Načtení členů týmu
  const { data: teamData, error: teamError } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true })

  // Pokud nejsou data, zobrazíme chybovou zprávu
  if (contentError && contentError.code === "PGRST116") {
    return (
      <div className="space-y-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Databáze není připravena</h2>
            </div>
            <p className="text-red-700 mt-2">
              Tabulka "about_us_content" neexistuje. Spusťte prosím SQL skripty pro vytvoření tabulek.
            </p>
            <div className="mt-4 p-4 bg-red-100 rounded-lg">
              <p className="text-sm text-red-800 font-medium">Potřebné skripty:</p>
              <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                <li>scripts/create-about-us-tables.sql</li>
                <li>scripts/seed-about-us-data.sql</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (contentError) {
    console.error("Error fetching about us content:", contentError)
  }

  if (teamError) {
    console.error("Error fetching team data:", teamError)
  }

  const content = contentData as AboutUsContent | null
  const team = (teamData as TeamMember[]) || []

  return (
    <div className="space-y-8">
      {/* Hlavní obsah stránky */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Hlavní obsah stránky "O nás"
            {content?.updated_at && (
              <span className="text-sm font-normal text-gray-500">
                Naposledy upraveno: {new Date(content.updated_at).toLocaleString("cs-CZ")}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {content ? (
            <form action={updateAboutUsContent} className="space-y-4">
              <input type="hidden" name="id" value={content.id} />
              <div>
                <Label htmlFor="title">Nadpis stránky</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={content.title}
                  placeholder="Zadejte nadpis stránky O nás"
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Hlavní text</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={content.content}
                  placeholder="Zadejte hlavní text stránky O nás"
                  rows={6}
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <Button type="submit">Uložit změny</Button>
                <Button type="button" variant="outline" asChild>
                  <a href="/o-nas" target="_blank" rel="noreferrer">
                    Zobrazit stránku
                  </a>
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Obsah stránky nebyl nalezen.</p>
              <p className="text-sm text-gray-500 mt-1">Zkontrolujte, zda byly spuštěny databázové skripty.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Správa týmu */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Správa týmu
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({team.length} {team.length === 1 ? "člen" : team.length < 5 ? "členové" : "členů"})
            </span>
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Přidat člena
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nový člen týmu</DialogTitle>
              </DialogHeader>
              <form action={addTeamMember} className="space-y-4">
                <FormFields />
                <Button type="submit" className="w-full">
                  Přidat člena
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {team.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jméno</TableHead>
                  <TableHead>Pozice</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-20">Pořadí</TableHead>
                  <TableHead className="text-right w-24">Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>
                      {member.email ? (
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                          {member.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>{member.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Upravit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Upravit člena týmu</DialogTitle>
                            </DialogHeader>
                            <form action={updateTeamMember} className="space-y-4">
                              <input type="hidden" name="id" value={member.id} />
                              <FormFields member={member} />
                              <Button type="submit" className="w-full">
                                Uložit změny
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <form action={deleteTeamMember}>
                          <input type="hidden" name="id" value={member.id} />
                          <Button
                            variant="ghost"
                            size="icon"
                            type="submit"
                            title="Smazat"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <PlusCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Zatím není přidán žádný člen týmu.</p>
              <p className="text-sm text-gray-500 mt-1">
                Klikněte na tlačítko "Přidat člena" pro přidání prvního člena.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Pomocná komponenta pro formulářová pole
function FormFields({ member }: { member?: TeamMember }) {
  return (
    <>
      <div>
        <Label htmlFor="name">Jméno a příjmení *</Label>
        <Input id="name" name="name" defaultValue={member?.name ?? ""} placeholder="Jan Novák" required />
      </div>
      <div>
        <Label htmlFor="position">Pozice *</Label>
        <Input
          id="position"
          name="position"
          defaultValue={member?.position ?? ""}
          placeholder="Projektový manažer"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={member?.email ?? ""}
          placeholder="jan.novak@delejcotebavi.com"
        />
      </div>
      <div>
        <Label htmlFor="image_url">URL obrázku</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={member?.image_url ?? ""}
          placeholder="https://example.com/foto.jpg"
        />
      </div>
      <div>
        <Label htmlFor="display_order">Pořadí zobrazení</Label>
        <Input
          id="display_order"
          name="display_order"
          type="number"
          defaultValue={member?.display_order ?? 0}
          min={0}
          placeholder="0"
        />
        <p className="text-xs text-gray-500 mt-1">Nižší číslo = vyšší pozice v seznamu</p>
      </div>
    </>
  )
}
