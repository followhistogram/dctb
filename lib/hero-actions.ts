"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export interface HeroContent {
  id: string
  badge_text: string
  title: string
  subtitle: string
  button1_text: string
  button1_link: string
  button2_text: string
  button2_link: string
  image_url: string | null
  image_alt: string
  stat1_value: string
  stat1_label: string
  stat2_value: string
  stat2_label: string
  stat3_value: string
  stat3_label: string
}

export async function getHeroContent(): Promise<HeroContent | null> {
  const { data, error } = await supabaseAdmin.from("hero_section").select("*").single()
  if (error) {
    console.error("Error fetching hero content:", error.message)
    return null
  }
  return data
}

export async function updateHeroContent(formData: FormData) {
  const id = formData.get("id") as string

  const content: Omit<HeroContent, "id"> = {
    badge_text: formData.get("badge_text") as string,
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string,
    button1_text: formData.get("button1_text") as string,
    button1_link: formData.get("button1_link") as string,
    button2_text: formData.get("button2_text") as string,
    button2_link: formData.get("button2_link") as string,
    image_url: formData.get("image_url") as string,
    image_alt: formData.get("image_alt") as string,
    stat1_value: formData.get("stat1_value") as string,
    stat1_label: formData.get("stat1_label") as string,
    stat2_value: formData.get("stat2_value") as string,
    stat2_label: formData.get("stat2_label") as string,
    stat3_value: formData.get("stat3_value") as string,
    stat3_label: formData.get("stat3_label") as string,
  }

  const { error } = await supabaseAdmin.from("hero_section").update(content).eq("id", id)

  if (error) {
    return { success: false, message: `Chyba při aktualizaci: ${error.message}` }
  }

  revalidatePath("/")
  revalidatePath("/admin/hero")

  return { success: true, message: "Hero sekce byla úspěšně aktualizována." }
}
