import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, User, ArrowRight, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getFilteredNews, getNewsCategories } from "@/lib/news-data"
import NewsFilters from "./news-filters"

export default async function NewsPage({
  searchParams,
}: {
  searchParams?: {
    q?: string
    category?: string
  }
}) {
  const query = searchParams?.q || ""
  const category = searchParams?.category || "Všechny"

  const articles = await getFilteredNews(query, category)
  const categories = await getNewsCategories()

  const featuredNews = articles.filter((article) => article.featured)
  const regularNews = articles.filter((article) => !article.featured)

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
          <Suspense fallback={<div>Načítání filtrů...</div>}>
            <NewsFilters categories={categories} totalFound={articles.length} />
          </Suspense>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && category === "Všechny" && !query && (
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
                        <Button className="bg-gradient-to-r from-[#c13aab] to-[#c13aab]/90 hover:from-[#c13aab]/90 hover:to-[#c13aab]/80 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
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
              {category !== "Všechny" ? `Aktuality - ${category}` : "Všechny aktuality"}
            </h2>
            <p className="text-lg text-gray-600">Chronologický přehled všech našich zpráv</p>
          </div>

          {articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
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
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-[#00acb9] to-[#00acb9]/90 hover:from-[#00acb9]/90 hover:to-[#00acb9]/80 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                          >
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
                {query || category !== "Všechny"
                  ? "Zkuste změnit vyhledávací kritéria."
                  : "Momentálně nemáme žádné aktuality k zobrazení."}
              </p>
              {(query || category !== "Všechny") && (
                <Link href="/aktuality">
                  <Button
                    variant="outline"
                    className="border-2 border-[#c13aab] text-[#c13aab] hover:bg-[#c13aab] hover:text-white bg-transparent font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Zobrazit všechny aktuality
                  </Button>
                </Link>
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
              <Button className="bg-white text-[#c13aab] hover:bg-white/90 whitespace-nowrap font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Přihlásit se
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
