"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function createProject(prevState: any, formData: FormData) {
  try {
    const rawFormData = Object.fromEntries(formData.entries())

    const title = rawFormData.title as string
    const subtitle = (rawFormData.subtitle as string) || null
    const slug = (rawFormData.slug as string) || generateSlug(title)
    const short_description = (rawFormData.short_description as string) || null
    const long_description = (rawFormData.long_description as string) || null
    const impact = (rawFormData.impact as string) || null
    const duration = (rawFormData.duration as string) || null
    const features = rawFormData.features
      ? (rawFormData.features as string)
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f)
      : null
    const project_link = (rawFormData.project_link as string) || null
    const icon = (rawFormData.icon as string) || null
    const color = (rawFormData.color as string) || null
    const category = (rawFormData.category as string) || null
    const type = (rawFormData.type as string) || "main"

    // Validate required fields
    if (!title || !slug) {
      return {
        message: "Název a slug jsou povinné",
        errors: {
          title: !title ? "Název je povinný" : undefined,
          slug: !slug ? "Slug je povinný" : undefined,
        },
      }
    }

    // Check if slug already exists
    const { data: existingProject } = await supabaseAdmin.from("projects").select("id").eq("slug", slug).single()

    if (existingProject) {
      return {
        message: "Projekt s tímto slug již existuje",
        errors: { slug: "Tento slug již existuje" },
      }
    }

    const { error } = await supabaseAdmin.from("projects").insert({
      title,
      subtitle,
      slug,
      short_description,
      long_description,
      impact,
      duration,
      features,
      project_link,
      icon,
      color,
      category,
      type,
    })

    if (error) {
      console.error("Error creating project:", error)
      return {
        message: "Chyba při vytváření projektu",
        errors: {},
      }
    }

    revalidatePath("/admin/projekty")
    revalidatePath("/projekty")
  } catch (error) {
    console.error("Error creating project:", error)
    return {
      message: "Neočekávaná chyba při vytváření projektu",
      errors: {},
    }
  }

  redirect("/admin/projekty")
}

export async function updateProject(id: string, prevState: any, formData: FormData) {
  try {
    const rawFormData = Object.fromEntries(formData.entries())

    const title = rawFormData.title as string
    const subtitle = (rawFormData.subtitle as string) || null
    const slug = rawFormData.slug as string
    const short_description = (rawFormData.short_description as string) || null
    const long_description = (rawFormData.long_description as string) || null
    const impact = (rawFormData.impact as string) || null
    const duration = (rawFormData.duration as string) || null
    const features = rawFormData.features
      ? (rawFormData.features as string)
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f)
      : null
    const project_link = (rawFormData.project_link as string) || null
    const icon = (rawFormData.icon as string) || null
    const color = (rawFormData.color as string) || null
    const category = (rawFormData.category as string) || null
    const type = (rawFormData.type as string) || "main"

    // Validate required fields
    if (!title || !slug) {
      return {
        message: "Název a slug jsou povinné",
        errors: {
          title: !title ? "Název je povinný" : undefined,
          slug: !slug ? "Slug je povinný" : undefined,
        },
      }
    }

    // Check if slug already exists (excluding current project)
    const { data: existingProject } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .single()

    if (existingProject) {
      return {
        message: "Projekt s tímto slug již existuje",
        errors: { slug: "Tento slug již existuje" },
      }
    }

    const { error } = await supabaseAdmin
      .from("projects")
      .update({
        title,
        subtitle,
        slug,
        short_description,
        long_description,
        impact,
        duration,
        features,
        project_link,
        icon,
        color,
        category,
        type,
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating project:", error)
      return {
        message: "Chyba při aktualizaci projektu",
        errors: {},
      }
    }

    revalidatePath("/admin/projekty")
    revalidatePath("/projekty")
  } catch (error) {
    console.error("Error updating project:", error)
    return {
      message: "Neočekávaná chyba při aktualizaci projektu",
      errors: {},
    }
  }

  redirect("/admin/projekty")
}

export async function deleteProject(id: string) {
  try {
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      throw new Error("Chyba při mazání projektu")
    }

    revalidatePath("/admin/projekty")
    revalidatePath("/projekty")
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}
