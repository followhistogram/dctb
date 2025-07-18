/**
 * Vylepšené admin actions s validací a bezpečnostními kontrolami
 */
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "./supabase-server"
import { newsArticleSchema } from "./validation-schemas"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import DOMPurify from "isomorphic-dompurify"

// Kontrola admin oprávnění
async function checkAdminPermission() {
  const cookieStore = cookies()
  const token = cookieStore.get('sb-access-token')?.value

  if (!token) {
    throw new Error('Neautentizovaný uživatel')
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    throw new Error('Neplatný token')
  }

  // Zde by měla být kontrola admin role
  const { data: userRole } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (userRole?.role !== 'admin') {
    throw new Error('Nedostatečná oprávnění')
  }

  return user
}

// Sanitizace HTML obsahu
function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel']
  })
}

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

// Vytvoření článku s validací
export async function createNewsArticle(formData: FormData) {
  try {
    // Kontrola oprávnění
    const user = await checkAdminPermission()

    // Validace vstupních dat
    const rawData = {
      title: formData.get("title") as string,
      perex: formData.get("perex") as string,
      content: formData.get("content") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      tags: (formData.get("tags") as string)
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean) || [],
      imageUrl: formData.get("imageUrl") as string,
      featured: formData.get("featured") === "on",
      readTime: parseInt(formData.get("readTime") as string) || 5,
    }

    // Validace pomocí Zod
    const validatedData = newsArticleSchema.parse(rawData)

    // Sanitizace HTML obsahu
    const sanitizedContent = sanitizeHtml(validatedData.content)
    const sanitizedPerex = sanitizeHtml(validatedData.perex)

    const slug = generateSlug(validatedData.title)

    // Kontrola duplicitního slugu
    const { data: existingArticle } = await supabaseAdmin
      .from("news_articles")
      .select("id")
      .eq("slug", slug)
      .single()

    if (existingArticle) {
      throw new Error("Článek s tímto názvem již existuje")
    }

    const { data, error } = await supabaseAdmin
      .from("news_articles")
      .insert({
        slug,
        title: validatedData.title,
        perex: sanitizedPerex,
        content: sanitizedContent,
        author: validatedData.author,
        category: validatedData.category,
        tags: validatedData.tags,
        image_url: validatedData.imageUrl || null,
        featured: validatedData.featured,
        read_time: validatedData.readTime,
        published_at: new Date().toISOString(),
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw new Error("Nepodařilo se vytvořit článek")
    }

    // Logování akce
    await supabaseAdmin
      .from("admin_logs")
      .insert({
        user_id: user.id,
        action: "CREATE_ARTICLE",
        resource_id: data.id,
        details: { title: validatedData.title }
      })

    revalidatePath("/admin/aktuality")
    revalidatePath("/aktuality")
    redirect("/admin/aktuality")
  } catch (error) {
    console.error("Error creating article:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Nepodařilo se vytvořit článek")
  }
}

// Aktualizace článku
export async function updateNewsArticle(id: string, formData: FormData) {
  try {
    // Kontrola oprávnění
    const user = await checkAdminPermission()

    // Validace ID
    if (!id || typeof id !== 'string') {
      throw new Error('Neplatné ID článku')
    }

    // Validace vstupních dat
    const rawData = {
      title: formData.get("title") as string,
      perex: formData.get("perex") as string,
      content: formData.get("content") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      tags: (formData.get("tags") as string)
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean) || [],
      imageUrl: formData.get("imageUrl") as string,
      featured: formData.get("featured") === "on",
      readTime: parseInt(formData.get("readTime") as string) || 5,
    }

    const validatedData = newsArticleSchema.parse(rawData)

    // Sanitizace HTML obsahu
    const sanitizedContent = sanitizeHtml(validatedData.content)
    const sanitizedPerex = sanitizeHtml(validatedData.perex)

    const { error } = await supabaseAdmin
      .from("news_articles")
      .update({
        title: validatedData.title,
        perex: sanitizedPerex,
        content: sanitizedContent,
        author: validatedData.author,
        category: validatedData.category,
        tags: validatedData.tags,
        image_url: validatedData.imageUrl || null,
        featured: validatedData.featured,
        read_time: validatedData.readTime,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq("id", id)

    if (error) {
      console.error("Database error:", error)
      throw new Error("Nepodařilo se aktualizovat článek")
    }

    // Logování akce
    await supabaseAdmin
      .from("admin_logs")
      .insert({
        user_id: user.id,
        action: "UPDATE_ARTICLE",
        resource_id: id,
        details: { title: validatedData.title }
      })

    revalidatePath("/admin/aktuality")
    revalidatePath("/aktuality")
    redirect("/admin/aktuality")
  } catch (error) {
    console.error("Error updating article:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Nepodařilo se aktualizovat článek")
  }
}

// Smazání článku
export async function deleteNewsArticle(id: string) {
  try {
    // Kontrola oprávnění
    const user = await checkAdminPermission()

    // Validace ID
    if (!id || typeof id !== 'string') {
      throw new Error('Neplatné ID článku')
    }

    // Získání informací o článku před smazáním
    const { data: article } = await supabaseAdmin
      .from("news_articles")
      .select("title")
      .eq("id", id)
      .single()

    const { error } = await supabaseAdmin
      .from("news_articles")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Database error:", error)
      throw new Error("Nepodařilo se smazat článek")
    }

    // Logování akce
    await supabaseAdmin
      .from("admin_logs")
      .insert({
        user_id: user.id,
        action: "DELETE_ARTICLE",
        resource_id: id,
        details: { title: article?.title || "Neznámý článek" }
      })

    revalidatePath("/admin/aktuality")
    revalidatePath("/aktuality")
  } catch (error) {
    console.error("Error deleting article:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Nepodařilo se smazat článek")
  }
}

// Přepnutí featured statusu
export async function toggleFeatured(id: string, featured: boolean) {
  try {
    // Kontrola oprávnění
    const user = await checkAdminPermission()

    // Validace ID
    if (!id || typeof id !== 'string') {
      throw new Error('Neplatné ID článku')
    }

    const { error } = await supabaseAdmin
      .from("news_articles")
      .update({ 
        featured,
        updated_at: new Date().toISOString(),
        updated_by: user.id
      })
      .eq("id", id)

    if (error) {
      console.error("Database error:", error)
      throw new Error("Nepodařilo se změnit stav hlavní aktuality")
    }

    // Logování akce
    await supabaseAdmin
      .from("admin_logs")
      .insert({
        user_id: user.id,
        action: "TOGGLE_FEATURED",
        resource_id: id,
        details: { featured }
      })

    revalidatePath("/admin/aktuality")
    revalidatePath("/aktuality")
  } catch (error) {
    console.error("Error toggling featured:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Nepodařilo se změnit stav hlavní aktuality")
  }
}
