"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export interface SiteSettings {
  id?: number
  logo_url: string
  seo_title: string
  seo_description: string
  seo_keywords: string
  created_at?: string
  updated_at?: string
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabaseAdmin.from("site_settings").select("*").single()

    if (error) {
      console.error("Error fetching settings:", error)
      // Return default values if table doesn't exist or no data
      return {
        logo_url: "/logo.png",
        seo_title: "Dělej co tě baví",
        seo_description: "Organizace zaměřená na rozvoj dětí a mládeže prostřednictvím aktivit a projektů.",
        seo_keywords: "děti, mládež, aktivity, projekty, rozvoj",
      }
    }

    return (
      data || {
        logo_url: "/logo.png",
        seo_title: "Dělej co tě baví",
        seo_description: "Organizace zaměřená na rozvoj dětí a mládeže prostřednictvím aktivit a projektů.",
        seo_keywords: "děti, mládež, aktivity, projekty, rozvoj",
      }
    )
  } catch (error) {
    console.error("Error in getSiteSettings:", error)
    return {
      logo_url: "/logo.png",
      seo_title: "Dělej co tě baví",
      seo_description: "Organizace zaměřená na rozvoj dětí a mládeže prostřednictvím aktivit a projektů.",
      seo_keywords: "děti, mládež, aktivity, projekty, rozvoj",
    }
  }
}

export async function updateSiteSettings(settings: Omit<SiteSettings, "id" | "created_at" | "updated_at">) {
  try {
    // First check if any settings exist
    const { data: existing } = await supabaseAdmin.from("site_settings").select("id").single()

    let result
    if (existing) {
      // Update existing settings
      result = await supabaseAdmin
        .from("site_settings")
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single()
    } else {
      // Insert new settings
      result = await supabaseAdmin
        .from("site_settings")
        .insert({
          ...settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
    }

    if (result.error) {
      console.error("Error updating settings:", result.error)
      return { success: false, error: result.error.message }
    }

    revalidatePath("/admin/nastaveni")
    revalidatePath("/", "layout") // Revalidate all pages to update header logo

    return { success: true, data: result.data }
  } catch (error) {
    console.error("Error in updateSiteSettings:", error)
    return { success: false, error: "Nepodařilo se aktualizovat nastavení" }
  }
}
