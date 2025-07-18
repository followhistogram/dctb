import { createServerClient } from "@/lib/supabase-server"
import { unstable_noStore as noStore } from "next/cache"

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
  const supabase = createServerClient()
  const { data: news, error } = await supabase
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching news:", error)
    return []
  }

  return news || []
}

export async function getFilteredNews(query: string, category: string) {
  noStore() // Opt out of caching for dynamic filtering
  const supabase = createServerClient()

  let supabaseQuery = supabase.from("news_articles").select("*").order("published_at", { ascending: false })

  if (query) {
    supabaseQuery = supabaseQuery.ilike("title", `%${query}%`)
  }

  if (category && category !== "Všechny") {
    supabaseQuery = supabaseQuery.eq("category", category)
  }

  const { data, error } = await supabaseQuery

  if (error) {
    console.error("Error fetching filtered news:", error)
    return []
  }
  return data || []
}

export async function getNewsArticleBySlug(slug: string) {
  const supabase = createServerClient()
  const { data: news, error } = await supabase.from("news_articles").select("*").eq("slug", slug).single()

  if (error || !news) {
    return null
  }

  return news
}

export async function getRelatedNewsArticles(articleId: string, category: string, limit = 3) {
  const supabase = createServerClient()
  const { data: news, error } = await supabase
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
  const supabase = createServerClient()
  const { data: news, error } = await supabase
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

export async function getNewsCategories() {
  noStore()
  const supabase = createServerClient()
  const { data, error } = await supabase.from("news_articles").select("category")

  if (error) {
    console.error("Error fetching categories:", error)
    return ["Všechny"]
  }

  const uniqueCategories = ["Všechny", ...new Set(data?.map((item) => item.category) || [])]
  return uniqueCategories
}

export const newsCategories = ["Všechny", "Projekty", "Partnerství", "Tábory", "Granty", "Workshopy", "Organizace"]
