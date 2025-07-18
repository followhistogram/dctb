"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Search, Filter, ArrowRight, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase-client"
import type { NewsArticle } from "@/lib/supabase"

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Všechny")
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArticles()
  }, [])

  useEffect(() => {
    filterNews()
  }, [searchTerm, selectedCategory, articles])

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("published_at", { ascending: false })

      if (error) throw error

      setArticles(data || [])

      // Extract unique categories
      const uniqueCategories = ["Všechny", ...new Set(data?.map((article) => article.category) || [])]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error loading articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterNews = () => {
    let filtered = articles

    // Filter by category
    if (selectedCategory !== "Všechny") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.perex.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredNews(filtered)
  }

  const featuredNews = articles.filter((article) => article.featured)
  const regularNews = filteredNews.filter((article) => !article.featured)

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <section className="py-20 bg-gradient-to-br from-[#c13aab]/10 to-[#00acb9]/10">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6">
              <div className="w-24 h-8 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
              <div className="w-96 h-16 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
              <div className="w-full max-w-3xl h-6 bg-gray-200 rounded mx-auto animate-pulse"></div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#c13aab]/10 to-[#00acb9]/10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge className="bg-[#c13aab]/10 text-[#c13aab] border-[#c13aab]/20 text-base px-4 py-2">Aktuality</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-[#111]">
              Naše{" "}
              <span className="bg-gradient-to-r from-[#c13aab] to-[#00acb9] bg-clip-text text-transparent">
                aktuality
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Sledujte naše nejnovější zprávy, úspěchy projektů a důležité oznámení. Zůstaňte v obraze o tom, co se u
              nás děje.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Hledat aktuality..."
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
              Nalezeno {filteredNews.length} {filteredNews.length === 1 ? "aktualita" : "aktualit"}
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && selectedCategory === "Všechny" && !searchTerm && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-4">Hlavní aktuality</h2>
              <p className="text-lg text-gray-600">Nejdůležitější zprávy a oznámení</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredNews.slice(0, 2).map((article) => (
                <Card
                  key={article.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  <div className="relative">
                    <Image
                      src={article.image_url || "/placeholder.svg"}
                      alt={article.title}
                      width={600}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#c13aab] text-white">Hlavní aktualita</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-[#111]">
                        {article.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.published_at).toLocaleDateString("cs-CZ")}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.read_time} min čtení
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-[#111] group-hover:text-[#c13aab] transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">{article.perex}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link href={`/aktuality/${article.slug}`}>
                        <Button className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">
                          Číst více
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All News */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#111] mb-4">
              {selectedCategory !== "Všechny" ? `Aktuality - ${selectedCategory}` : "Všechny aktuality"}
            </h2>
            <p className="text-lg text-gray-600">Chronologický přehled všech našich zpráv</p>
          </div>

          {filteredNews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article) => (
                <Card
                  key={article.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={article.image_url || "/placeholder.svg"}
                      alt={article.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#00acb9] text-white">{article.category}</Badge>
                    </div>
                    {article.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-[#c13aab] text-white">Hlavní</Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-4 flex-grow">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.published_at).toLocaleDateString("cs-CZ")}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.read_time} min
                      </div>
                    </div>
                    <CardTitle className="text-lg text-[#111] group-hover:text-[#c13aab] transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 leading-relaxed">{article.perex}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          <User className="w-4 h-4 inline mr-1" />
                          {article.author}
                        </span>
                        <Link href={`/aktuality/${article.slug}`}>
                          <Button size="sm" className="bg-[#00acb9] hover:bg-[#00acb9]/90 text-white">
                            Číst více
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-[#111] mb-2">Žádné aktuality nenalezeny</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== "Všechny"
                  ? "Zkuste změnit vyhledávací kritéria."
                  : "Momentálně nemáme žádné aktuality k zobrazení."}
              </p>
              {(searchTerm || selectedCategory !== "Všechny") && (
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("Všechny")
                  }}
                  variant="outline"
                  className="border-[#c13aab] text-[#c13aab] hover:bg-[#c13aab] hover:text-white bg-transparent"
                >
                  Zobrazit všechny aktuality
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-r from-[#c13aab] to-[#00acb9]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">Nezmeškejte žádnou aktualitu</h2>
            <p className="text-xl text-white/90">
              Přihlaste se k odběru našeho newsletteru a buďte první, kdo se dozví o našich novinkách a akcích.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Váš email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white"
              />
              <Button className="bg-white text-[#c13aab] hover:bg-white/90 whitespace-nowrap">Přihlásit se</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
