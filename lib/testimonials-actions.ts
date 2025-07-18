"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export interface Testimonial {
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

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching testimonials:", error)
    throw new Error("Nepodařilo se načíst reference")
  }

  return data || []
}

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching active testimonials:", error)
    throw new Error("Nepodařilo se načíst reference")
  }

  return data || []
}

export async function createTestimonial(formData: FormData) {
  const testimonialData = {
    name: formData.get("name") as string,
    position: formData.get("position") as string,
    text: formData.get("text") as string,
    photo_url: (formData.get("photo_url") as string) || null,
    rating: Number.parseInt(formData.get("rating") as string) || 5,
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
  }

  const { error } = await supabaseAdmin.from("testimonials").insert([testimonialData])

  if (error) {
    console.error("Error creating testimonial:", error)
    return { success: false, message: "Nepodařilo se vytvořit referenci." }
  }

  revalidatePath("/admin/reference")
  revalidatePath("/reference")
  return { success: true, message: "Reference byla úspěšně vytvořena." }
}

export async function updateTestimonial(id: string, formData: FormData) {
  const testimonialData = {
    name: formData.get("name") as string,
    position: formData.get("position") as string,
    text: formData.get("text") as string,
    photo_url: (formData.get("photo_url") as string) || null,
    rating: Number.parseInt(formData.get("rating") as string) || 5,
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
  }

  const { error } = await supabaseAdmin.from("testimonials").update(testimonialData).eq("id", id)

  if (error) {
    console.error("Error updating testimonial:", error)
    return { success: false, message: "Nepodařilo se aktualizovat referenci." }
  }

  revalidatePath("/admin/reference")
  revalidatePath("/reference")
  return { success: true, message: "Reference byla úspěšně aktualizována." }
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id)

  if (error) {
    console.error("Error deleting testimonial:", error)
    return { success: false, message: "Nepodařilo se smazat referenci." }
  }

  revalidatePath("/admin/reference")
  revalidatePath("/reference")
  return { success: true, message: "Reference byla úspěšně smazána." }
}

export async function toggleTestimonialStatus(id: string, isActive: boolean) {
  const { error } = await supabaseAdmin.from("testimonials").update({ is_active: isActive }).eq("id", id)

  if (error) {
    console.error("Error toggling testimonial status:", error)
    return { success: false, message: "Nepodařilo se změnit stav reference." }
  }

  revalidatePath("/admin/reference")
  revalidatePath("/reference")
  return { success: true, message: `Reference byla ${isActive ? "aktivována" : "deaktivována"}.` }
}
