"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "./supabase-server"

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
  const title = formData.get("title") as string
  const perex = formData.get("perex") as string
  const content = formData.get("content") as string
  const author = formData.get("author") as string
  const category = formData.get("category") as string
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
  const imageUrl = formData.get("imageUrl") as string
  const featured = formData.get("featured") === "on"
  const readTime = Number.parseInt(formData.get("readTime") as string) || 5

  const slug = generateSlug(title)

  try {
    const { data, error } = await supabaseAdmin
      .from("news_articles")
      .insert({
        slug,
        title,
        perex,
        content,
        author,
        category,
        tags,
        image_url: imageUrl || null,
        featured,
        read_time: readTime,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating article:", error)
      throw new Error("Nepodařilo se vytvořit článek")
    }

    revalidatePath("/admin/aktuality")
    revalidatePath("/aktuality")
    redirect("/admin/aktuality")
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}

// Update news article
export async function updateNewsArticle(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const perex = formData.get("perex") as string
  const content = formData.get("content") as string
  const author = formData.get("author") as string
  const category = formData.get("category") as string
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
  const imageUrl = formData.get("imageUrl") as string
  const featured = formData.get("featured") === "on"
  const readTime = Number.parseInt(formData.get("readTime") as string) || 5

  try {
    const { error } = await supabaseAdmin
      .from("news_articles")
      .update({
        title,
        perex,
        content,
        author,
        category,
        tags,
        image_url: imageUrl || null,
        featured,
        read_time: readTime,
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
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}

// Delete news article
export async function deleteNewsArticle(id: string) {
  try {
    const { error } = await supabaseAdmin.from("news_articles").delete().eq("id", id)

    if (error) {
      console.error("Error deleting article:", error)
      throw new Error("Nepodařilo se smazat článek")
    }

    revalidatePath("/admin/aktuality")
    revalidatePath("/aktuality")
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}

// Toggle featured status
export async function toggleFeatured(id: string, featured: boolean) {
  try {
    const { error } = await supabaseAdmin.from("news_articles").update({ featured }).eq("id", id)

    if (error) {
      console.error("Error toggling featured:", error)
      throw new Error("Nepodařilo se změnit stav hlavní aktuality")
    }

    revalidatePath("/admin/aktuality")
    revalidatePath("/aktuality")
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}
