"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { z } from "zod"

const NewsArticleSchema = z.object({
  title: z.string().min(1, "Název je povinný."),
  perex: z.string().min(1, "Perex je povinný."),
  content: z.string().min(1, "Obsah je povinný."),
  category: z.string().min(1, "Kategorie je povinná."),
  image_url: z.string().url("URL obrázku musí být platná URL.").optional().or(z.literal("")),
  slug: z.string().min(1, "Slug je povinný."),
  published_at: z.string().optional(),
})

export type State = {
  errors?: {
    title?: string[]
    perex?: string[]
    content?: string[]
    category?: string[]
    image_url?: string[]
    slug?: string[]
  }
  message?: string | null
}

export async function createNewsArticle(prevState: State, formData: FormData) {
  const supabase = createServerClient()

  const validatedFields = NewsArticleSchema.safeParse({
    title: formData.get("title"),
    perex: formData.get("perex"),
    content: formData.get("content"),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
    slug: formData.get("slug"),
    published_at: formData.get("published_at"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Chyba: Zkontrolujte zadané údaje.",
    }
  }

  const { data, error } = await supabase.from("news_articles").insert([validatedFields.data])

  if (error) {
    return {
      message: `Chyba databáze: ${error.message}`,
    }
  }

  revalidatePath("/admin/aktuality")
  revalidatePath("/aktuality")
  redirect("/admin/aktuality")
}

export async function updateNewsArticle(id: string, prevState: State, formData: FormData) {
  const supabase = createServerClient()

  const validatedFields = NewsArticleSchema.safeParse({
    title: formData.get("title"),
    perex: formData.get("perex"),
    content: formData.get("content"),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
    slug: formData.get("slug"),
    published_at: formData.get("published_at"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Chyba: Zkontrolujte zadané údaje.",
    }
  }

  const { data, error } = await supabase.from("news_articles").update(validatedFields.data).eq("id", id)

  if (error) {
    return {
      message: `Chyba databáze: ${error.message}`,
    }
  }

  revalidatePath(`/admin/aktuality`)
  revalidatePath(`/admin/aktuality/${id}/edit`)
  revalidatePath(`/aktuality/${validatedFields.data.slug}`)
  redirect("/admin/aktuality")
}

export async function deleteNewsArticle(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("news_articles").delete().eq("id", id)

  if (error) {
    return {
      message: `Chyba databáze: ${error.message}`,
    }
  }

  revalidatePath("/admin/aktuality")
  revalidatePath("/aktuality")
}
