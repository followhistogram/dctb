// ./app/admin/aktuality/[id]/edit/page.tsx

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, AlertCircle, Eye } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { updateNewsArticle } from "@/lib/admin-actions"
import RichTextEditor from "@/components/rich-text-editor"

const categories = ["Projekty", "Partnerství", "Tábory", "Granty", "Workshopy", "Organizace"]

interface NewsArticle {
  id: string
  slug: string
  title: string
  perex: string
  content: string
  author: string
  category: string
  tags: string[]
  image_url: string | null
  featured: boolean
  read_time: number
  published_at: string
  created_at: string
  updated_at: string
}

function isNewsArticle(obj: any): obj is NewsArticle {
  if (!obj) return false
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.slug === "string" &&
    typeof obj.content === "string" &&
    Array.isArray(obj.tags)
  )
}

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contentHtml, setContentHtml] = useState<string>("")

  useEffect(() => {
    fetchArticleData()
  }, [params.id])

  const fetchArticleData = async () => {
    setError(null)
    setLoading(true)

    try {
      const { data, error: dbError } = await supabase.from("news_articles").select("*").eq("id", params.id).single()

      if (dbError || !data) {
        notFound()
        return
      }

      if (isNewsArticle(data)) {
        setArticle(data)
        setContentHtml(data.content)
      } else {
        console.error("Načtená data neodpovídají struktuře NewsArticle:", data)
        setError("Data článku se nepodařilo správně načíst. Mají nesprávný formát.")
      }
    } catch (err) {
      console.error("Error loading article:", err)
      setError("Došlo k neočekávané chybě při načítání článku.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setSaving(true)
    setError(null)

    try {
      await updateNewsArticle(params.id, formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Došlo k chybě při aktualizaci článku")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="w-48 h-8 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="w-full h-96 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="space-y-6">
            <div className="w-full h-48 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !article) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">{error}</AlertDescription>
      </Alert>
    )
  }

  if (!article) {
    notFound()
    return null // Přidáno pro jistotu, aby se zamezilo chybám, pokud notFound nefunguje jak má
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/aktuality">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zpět na články
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#111]">Editace článku</h1>
            <p className="text-gray-600 mt-1">Upravte existující aktualitu</p>
          </div>
        </div>
        <Link href={`/aktuality/${article.slug}`} target="_blank">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Náhled
          </Button>
        </Link>
      </div>

      <form action={handleSubmit} className="space-y-6">
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
                  <Input
                    id="title"
                    name="title"
                    defaultValue={article.title}
                    placeholder="Zadejte nadpis článku"
                    required
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perex" className="text-sm font-medium">
                    Perex *
                  </Label>
                  <Textarea
                    id="perex"
                    name="perex"
                    defaultValue={article.perex}
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
                  <Checkbox id="featured" name="featured" defaultChecked={article.featured} />
                  <Label htmlFor="featured" className="text-sm">
                    Hlavní aktualita
                  </Label>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[#c13aab] hover:bg-[#c13aab]/90 text-white"
                  >
                    {saving ? (
                      <>Ukládám...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Uložit změny
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
                  <Input id="author" name="author" defaultValue={article.author} placeholder="Jméno autora" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Kategorie *
                  </Label>
                  <Select name="category" defaultValue={article.category} required>
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
                  <Input
                    id="tags"
                    name="tags"
                    defaultValue={Array.isArray(article.tags) ? article.tags.join(", ") : ""}
                    placeholder="štítek1, štítek2, štítek3"
                  />
                  <p className="text-xs text-gray-500">Oddělte štítky čárkami</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime" className="text-sm font-medium">
                    Čas čtení (minuty)
                  </Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    type="number"
                    defaultValue={article.read_time}
                    placeholder="5"
                    min="1"
                    max="60"
                  />
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
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    defaultValue={article.image_url || ""}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500">Odkaz na hlavní obrázek článku</p>
                </div>
                {article.image_url && (
                  <div className="mt-4">
                    <img
                      src={article.image_url || "/placeholder.svg"}
                      alt="Náhled obrázku"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">Informace o článku</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <div>
                  <strong>Vytvořeno:</strong> {new Date(article.created_at).toLocaleString("cs-CZ")}
                </div>
                <div>
                  <strong>Naposledy upraveno:</strong> {new Date(article.updated_at).toLocaleString("cs-CZ")}
                </div>
                <div>
                  <strong>Publikováno:</strong> {new Date(article.published_at).toLocaleString("cs-CZ")}
                </div>
                <div>
                  <strong>URL slug:</strong> <code className="bg-gray-200 px-1 rounded">{article.slug}</code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
