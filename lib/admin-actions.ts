"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { newsArticleSchema } from "./validation-schemas"

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
}

// Create news article
export async function createNewsArticle(formData: FormData) {
  const supabase = createServerClient()

  const rawData = {
    title: formData.get("title") as string,
    perex: formData.get("perex") as string,
    content: formData.get("content") as string,
    author: formData.get("author") as string,
    category: formData.get("category") as string,
    tags:
      (formData.get("tags") as string)
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean) || [],
    imageUrl: formData.get("imageUrl") as string,
    featured: formData.get("featured") === "on",
    readTime: Number.parseInt(formData.get("readTime") as string) || 5,
  }

  const validatedData = newsArticleSchema.parse(rawData)
  const slug = generateSlug(validatedData.title)

  const { error } = await supabase.from("news_articles").insert({
    slug,
    title: validatedData.title,
    perex: validatedData.perex,
    content: validatedData.content,
    author: validatedData.author,
    category: validatedData.category,
    tags: validatedData.tags,
    image_url: validatedData.imageUrl || null,
    featured: validatedData.featured,
    read_time: validatedData.readTime,
    published_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error creating article:", error)
    throw new Error("Nepodařilo se vytvořit článek")
  }

  revalidatePath("/admin/aktuality")
  revalidatePath("/aktuality")
  redirect("/admin/aktuality")
}

// Update news article
export async function updateNewsArticle(id: string, formData: FormData) {
  const supabase = createServerClient()

  const rawData = {
    title: formData.get("title") as string,
    perex: formData.get("perex") as string,
    content: formData.get("content") as string,
    author: formData.get("author") as string,
    category: formData.get("category") as string,
    tags:
      (formData.get("tags") as string)
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean) || [],
    imageUrl: formData.get("imageUrl") as string,
    featured: formData.get("featured") === "on",
    readTime: Number.parseInt(formData.get("readTime") as string) || 5,
  }

  const validatedData = newsArticleSchema.parse(rawData)

  const { error } = await supabase
    .from("news_articles")
    .update({
      title: validatedData.title,
      perex: validatedData.perex,
      content: validatedData.content,
      author: validatedData.author,
      category: validatedData.category,
      tags: validatedData.tags,
      image_url: validatedData.imageUrl || null,
      featured: validatedData.featured,
      read_time: validatedData.readTime,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating article:", error)
    throw new Error("Nepodařilo se aktualizovat článek")
  }

  revalidatePath("/admin/aktuality")
  revalidatePath("/aktuality")
  redirect("/admin/aktuality")
}

// Delete news article
export async function deleteNewsArticle(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("news_articles").delete().eq("id", id)

  if (error) {
    console.error("Error deleting article:", error)
    throw new Error("Nepodařilo se smazat článek")
  }

  revalidatePath("/admin/aktuality")
  revalidatePath("/aktuality")
}

// Toggle featured status
export async function toggleFeatured(id: string, featured: boolean) {
  const supabase = createServerClient()

  const { error } = await supabase
    .from("news_articles")
    .update({
      featured: !featured,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error toggling featured:", error)
    throw new Error("Nepodařilo se změnit stav hlavní aktuality")
  }

  revalidatePath("/admin/aktuality")
  revalidatePath("/aktuality")
}
