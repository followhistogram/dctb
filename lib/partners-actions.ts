"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export interface Partner {
  id: string
  name: string
  description: string | null
  website: string | null
  logo_url: string | null
  category: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PartnerCategory {
  id: string
  title: string
  description: string | null
  icon: string | null
  color: string | null
  display_order: number
}

export async function getAllPartners(): Promise<Partner[]> {
  const { data, error } = await supabaseAdmin
    .from("partners")
    .select("*")
    .order("category", { ascending: true })
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching partners:", error)
    throw new Error("Nepodařilo se načíst partnery")
  }

  return data || []
}

export async function getPartnersByCategory(): Promise<Record<string, Partner[]>> {
  const partners = await getAllPartners()
  const partnersByCategory: Record<string, Partner[]> = {}

  partners.forEach((partner) => {
    if (!partnersByCategory[partner.category]) {
      partnersByCategory[partner.category] = []
    }
    partnersByCategory[partner.category].push(partner)
  })

  return partnersByCategory
}

export async function getPartnerCategories(): Promise<PartnerCategory[]> {
  const { data, error } = await supabaseAdmin
    .from("partner_categories")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching partner categories:", error)
    throw new Error("Nepodařilo se načíst kategorie partnerů")
  }

  return data || []
}

export async function createPartner(formData: FormData) {
  const partnerData = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    website: (formData.get("website") as string) || null,
    logo_url: (formData.get("logo_url") as string) || null,
    category: formData.get("category") as string,
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
    is_active: formData.get("is_active") === "on",
  }

  const { error } = await supabaseAdmin.from("partners").insert([partnerData])

  if (error) {
    console.error("Error creating partner:", error)
    return { success: false, message: "Nepodařilo se vytvořit partnera." }
  }

  revalidatePath("/admin/partneri")
  revalidatePath("/partneri")
  return { success: true, message: "Partner byl úspěšně vytvořen." }
}

export async function updatePartner(formData: FormData) {
  const id = formData.get("id") as string
  const partnerData = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    website: (formData.get("website") as string) || null,
    logo_url: (formData.get("logo_url") as string) || null,
    category: formData.get("category") as string,
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
    is_active: formData.get("is_active") === "on",
  }

  const { error } = await supabaseAdmin.from("partners").update(partnerData).eq("id", id)

  if (error) {
    console.error("Error updating partner:", error)
    return { success: false, message: "Nepodařilo se aktualizovat partnera." }
  }

  revalidatePath("/admin/partneri")
  revalidatePath("/partneri")
  return { success: true, message: "Partner byl úspěšně aktualizován." }
}

export async function deletePartner(formData: FormData) {
  const id = formData.get("id") as string

  const { error } = await supabaseAdmin.from("partners").delete().eq("id", id)

  if (error) {
    console.error("Error deleting partner:", error)
    return { success: false, message: "Nepodařilo se smazat partnera." }
  }

  revalidatePath("/admin/partneri")
  revalidatePath("/partneri")
  return { success: true, message: "Partner byl úspěšně smazán." }
}

export async function togglePartnerStatus(formData: FormData) {
  const id = formData.get("id") as string
  const isActive = formData.get("is_active") === "true"

  const { error } = await supabaseAdmin.from("partners").update({ is_active: !isActive }).eq("id", id)

  if (error) {
    console.error("Error toggling partner status:", error)
    return { success: false, message: "Nepodařilo se změnit stav partnera." }
  }

  revalidatePath("/admin/partneri")
  revalidatePath("/partneri")
  return { success: true, message: "Stav partnera byl úspěšně změněn." }
}
