import { createServerClient } from "@/lib/supabase-server"

export interface NewsArticle {
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

export async function getAllNewsArticles(): Promise<NewsArticle[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("news_articles").select("*").order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching news articles:", error)
    return []
  }

  return data || []
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("news_articles").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching news article:", error)
    return null
  }

  return data
}

export async function getFeaturedNewsArticles(): Promise<NewsArticle[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("Error fetching featured news articles:", error)
    return []
  }

  return data || []
}

export async function getLatestNews(limit = 6): Promise<NewsArticle[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching latest news:", error)
    return []
  }

  return data || []
}

export async function getNewsArticlesByCategory(category: string): Promise<NewsArticle[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("category", category)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching news articles by category:", error)
    return []
  }

  return data || []
}

export async function searchNewsArticles(query: string): Promise<NewsArticle[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .or(`title.ilike.%${query}%,perex.ilike.%${query}%,content.ilike.%${query}%`)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error searching news articles:", error)
    return []
  }

  return data || []
}

export async function getNewsCategories(): Promise<string[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("news_articles").select("category").order("category")

  if (error) {
    console.error("Error fetching news categories:", error)
    return []
  }

  const categories = [...new Set(data?.map((item) => item.category) || [])]
  return categories
}
