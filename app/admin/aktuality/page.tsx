"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Edit, Trash2, Eye, Star, Calendar, User, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase-client"
import { deleteNewsArticle, toggleFeatured } from "@/lib/admin-actions"

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

function isNewsArticleArray(obj: any): obj is NewsArticle[] {
  return Array.isArray(obj) && obj.every(item => 
    item && 
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.slug === "string" &&
    typeof item.content === "string" &&
    Array.isArray(item.tags)
  )
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Všechny")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    loadArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm, selectedCategory])

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase.from("news_articles").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      if (isNewsArticleArray(data)) {
        setArticles(data)
        // OPRAVENO: Explicitně typujeme kategorii jako string
        const uniqueCategories: string[] = ["Všechny", ...new Set(data.map((article: NewsArticle) => article.category))]
        setCategories(uniqueCategories)
      } else {
        console.error("Data nejsou ve správném formátu:", data)
        setArticles([])
        setCategories(["Všechny"])
      }
    } catch (error) {
      console.error("Error loading articles:", error)
      setArticles([])
      setCategories(["Všechny"])
    } finally {
      setLoading(false)
    }
  }

  const filterArticles = () => {
    let filtered = articles

    if (selectedCategory !== "Všechny") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.perex.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredArticles(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu chcete smazat tento článek?")) return

    try {
      await deleteNewsArticle(id)
      await loadArticles()
    } catch (error) {
      console.error("Error deleting article:", error)
      alert("Nepodařilo se smazat článek")
    }
  }

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await toggleFeatured(id, !currentFeatured)
      await loadArticles()
    } catch (error) {
      console.error("Error toggling featured:", error)
      alert("Nepodařilo se změnit stav hlavní aktuality")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="w-48 h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-full h-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111]">Správa aktualit</h1>
          <p className="text-gray-600 mt-2">Spravujte články a aktuality na webu</p>
        </div>
        <Link href="/admin/aktuality/new">
          <Button className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nový článek
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Hledat články..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Kategorie" />
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
            <div className="text-sm text-gray-600">
              Nalezeno {filteredArticles.length} {filteredArticles.length === 1 ? "článek" : "článků"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <Card key={article.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Article Image */}
                  <div className="lg:w-48 flex-shrink-0">
                    <Image
                      src={article.image_url || "/placeholder.svg?height=120&width=200"}
                      alt={article.title}
                      width={200}
                      height={120}
                      className="w-full lg:w-48 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Article Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-[#00acb9] text-white">{article.category}</Badge>
                        {article.featured && (
                          <Badge className="bg-[#c13aab] text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Hlavní
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleFeatured(article.id, article.featured)}
                          className={article.featured ? "border-[#c13aab] text-[#c13aab]" : ""}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                        <Link href={`/aktuality/${article.slug}`} target="_blank">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/aktuality/${article.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-[#111] mb-2 line-clamp-2">{article.title}</h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">{article.perex}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.published_at).toLocaleDateString("cs-CZ")}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.read_time} min čtení
                      </div>
                    </div>

                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{article.tags.length - 3} dalších
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-[#111] mb-2">Žádné články nenalezeny</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== "Všechny"
                  ? "Zkuste změnit vyhledávací kritéria."
                  : "Zatím nebyly vytvořeny žádné články."}
              </p>
              {searchTerm || selectedCategory !== "Všechny" ? (
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("Všechny")
                  }}
                  variant="outline"
                >
                  Zobrazit všechny články
                </Button>
              ) : (
                <Link href="/admin/aktuality/new">
                  <Button className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Vytvořit první článek
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
