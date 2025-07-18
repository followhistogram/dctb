import { supabaseAdmin } from "@/lib/supabase-server"

export interface NewsArticle {
  id: string
  slug: string
  title: string
  perex: string
  content: string
  publishedAt: string
  author: string
  category: string
  tags: string[]
  image: string
  featured: boolean
  readTime: number
}

export async function getAllNews() {
  const { data: news, error } = await supabaseAdmin
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching news:", error)
    return []
  }

  return news || []
}

export async function getNewsArticleBySlug(slug: string) {
  const { data: news, error } = await supabaseAdmin.from("news_articles").select("*").eq("slug", slug).single()

  if (error || !news) {
    return null
  }

  return news
}

export async function getRelatedNewsArticles(articleId: string, category: string, limit = 3) {
  const { data: news, error } = await supabaseAdmin
    .from("news_articles")
    .select("id, title, slug, image_url, perex")
    .eq("category", category)
    .neq("id", articleId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching related news:", error)
    return []
  }

  return news || []
}

export async function getLatestNews(limit = 3) {
  const { data: news, error } = await supabaseAdmin
    .from("news_articles")
    .select("id, title, slug, image_url, created_at, perex")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching latest news:", error)
    return []
  }

  return news || []
}

export const newsCategories = ["Všechny", "Projekty", "Partnerství", "Tábory", "Granty", "Workshopy", "Organizace"]
