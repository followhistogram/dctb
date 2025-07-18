import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getNewsArticleBySlug, getRelatedNewsArticles } from "@/lib/news-data"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = await getNewsArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const relatedNews = await getRelatedNewsArticles(article.id, article.category)

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6">
        <Link href="/aktuality">
          <Button variant="ghost" className="text-gray-600 hover:text-[#c13aab]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět na přehled aktualit
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Article Content */}
        <div className="lg:col-span-2 space-y-6">
          {article.image_url && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={article.image_url || "/placeholder.svg"}
                alt={article.title}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          )}

          <h1 className="text-4xl font-extrabold text-[#111] leading-tight">{article.title}</h1>

          <div className="flex items-center space-x-4 text-gray-600 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{format(new Date(article.published_at), "d. M. yyyy", { locale: cs })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{article.read_time} min čtení</span>
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              <span>{article.category}</span>
            </div>
          </div>

          <p className="text-xl font-semibold text-gray-800 leading-relaxed border-l-4 border-[#c13aab] pl-4 italic">
            {article.perex}
          </p>

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              {article.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Related News */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#111] mb-4">Související aktuality</h3>
              <div className="space-y-4">
                {relatedNews.map((news) => (
                  <Link key={news.id} href={`/aktuality/${news.slug}`} className="block group">
                    <div className="flex items-center space-x-4">
                      {news.image_url && (
                        <div className="relative w-20 h-16 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                            src={news.image_url || "/placeholder.svg"}
                            alt={news.title}
                            fill
                            style={{ objectFit: "cover" }}
                            className="group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-medium text-[#111] group-hover:text-[#c13aab] transition-colors">
                          {news.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{news.perex}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
