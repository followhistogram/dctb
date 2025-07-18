"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export interface Reference {
  id: string
  name: string
  position: string
  text: string
  photo_url?: string
  rating: number
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export async function getAllReferences(): Promise<Reference[]> {
  const { data, error } = await supabaseAdmin.from("references").select("*").order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching references:", error)
    throw new Error("Nepodařilo se načíst reference")
  }

  return data || []
}

export async function getActiveReferences(): Promise<Reference[]> {
  const { data, error } = await supabaseAdmin
    .from("references")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching active references:", error)
    throw new Error("Nepodařilo se načíst reference")
  }

  return data || []
}

export async function createReference(formData: FormData) {
  const referenceData = {
    name: formData.get("name") as string,
    position: formData.get("position") as string,
    text: formData.get("text") as string,
    photo_url: (formData.get("photo_url") as string) || null,
    rating: Number.parseInt(formData.get("rating") as string) || 5,
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
  }

  const { error } = await supabaseAdmin.from("references").insert([referenceData])

  if (error) {
    console.error("Error creating reference:", error)
    return { success: false, message: "Nepodařilo se vytvořit referenci." }
  }

  revalidatePath("/admin/reference")
  revalidatePath("/reference")
  return { success: true, message: "Reference byla úspěšně vytvořena." }
}

export async function updateReference(id: string, formData: FormData) {
  const referenceData = {
    name: formData.get("name") as string,
    position: formData.get("position") as string,
    text: formData.get("text") as string,
    photo_url: (formData.get("photo_url") as string) || null,
    rating: Number.parseInt(formData.get("rating") as string) || 5,
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
  }

  const { error } = await supabaseAdmin.from("references").update(referenceData).eq("id", id)

  if (error) {
    console.error("Error updating reference:", error)
    return { success: false, message: "Nepodařilo se aktualizovat referenci." }
  }

  revalidatePath("/admin/reference")
  revalidatePath("/reference")
  return { success: true, message: "Reference byla úspěšně aktualizována." }
}

export async function deleteReference(id: string) {
  const { error } = await supabaseAdmin.from("references").delete().eq("id", id)

  if (error) {
    console.error("Error deleting reference:", error)
    return { success: false, message: "Nepodařilo se smazat referenci." }
  }

  revalidatePath("/admin/reference")
  revalidatePath("/reference")
  return { success: true, message: "Reference byla úspěšně smazána." }
}

export async function toggleReferenceStatus(id: string, isActive: boolean) {
  const { error } = await supabaseAdmin.from("references").update({ is_active: isActive }).eq("id", id)

  if (error) {
    console.error("Error toggling reference status:", error)
    return { success: false, message: "Nepodařilo se změnit stav reference." }
  }

  revalidatePath("/admin/reference")
  revalidatePath("/reference")
  return { success: true, message: `Reference byla ${isActive ? "aktivována" : "deaktivována"}.` }
}
