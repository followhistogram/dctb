"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createNewsArticle } from "@/lib/admin-actions"
import RichTextEditor from "@/components/rich-text-editor"

const categories = ["Projekty", "Partnerství", "Tábory", "Granty", "Workshopy", "Organizace"]

export default function NewArticlePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contentHtml, setContentHtml] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)  // <-- OPRAVENO: používáme setLoading místo setSaving
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      await createNewsArticle(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Došlo k chybě při vytváření článku")
    } finally {
      setLoading(false)  // <-- OPRAVENO: používáme setLoading místo setSaving
    }
  } // <-- PŘIDÁNO: uzavírací závorka funkce

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/aktuality">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět na články
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#111]">Nový článek</h1>
          <p className="text-gray-600 mt-1">Vytvořte novou aktualitu</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Obsah článku</CardTitle>
                <CardDescription>Základní informace o článku</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Nadpis *
                  </Label>
                  <Input id="title" name="title" placeholder="Zadejte nadpis článku" required className="text-lg" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perex" className="text-sm font-medium">
                    Perex *
                  </Label>
                  <Textarea
                    id="perex"
                    name="perex"
                    placeholder="Krátký úvod článku, který se zobrazí v přehledu"
                    required
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium">
                    Obsah článku *
                  </Label>
                  <RichTextEditor
                    id="content"
                    name="content"
                    defaultValue={contentHtml}
                    onChange={setContentHtml}
                    className="min-h-[400px]"
                  />
                  <p className="text-xs text-gray-500">Použijte formátovací nástroje pro úpravu obsahu.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Publikování</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" name="featured" />
                  <Label htmlFor="featured" className="text-sm">
                    Hlavní aktualita
                  </Label>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#c13aab] hover:bg-[#c13aab]/90 text-white"
                  >
                    {loading ? (
                      <>Ukládám...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Publikovat
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author" className="text-sm font-medium">
                    Autor *
                  </Label>
                  <Input id="author" name="author" placeholder="Jméno autora" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Kategorie *
                  </Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte kategorii" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium">
                    Štítky
                  </Label>
                  <Input id="tags" name="tags" placeholder="štítek1, štítek2, štítek3" />
                  <p className="text-xs text-gray-500">Oddělte štítky čárkami</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime" className="text-sm font-medium">
                    Čas čtení (minuty)
                  </Label>
                  <Input id="readTime" name="readTime" type="number" placeholder="5" min="1" max="60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Obrázek</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-sm font-medium">
                    URL obrázku
                  </Label>
                  <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://example.com/image.jpg" />
                  <p className="text-xs text-gray-500">Odkaz na hlavní obrázek článku</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
