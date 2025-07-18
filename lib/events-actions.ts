"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getEvents() {
  const { data, error } = await supabaseAdmin.from("events").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data || []
}

export async function getEventBySlug(slug: string) {
  const { data, error } = await supabaseAdmin.from("events").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return data
}

export async function getEventById(id: string) {
  const { data, error } = await supabaseAdmin.from("events").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return data
}

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const longDescription = formData.get("longDescription") as string
  const date = formData.get("date") as string
  const endDate = formData.get("endDate") as string
  const time = formData.get("time") as string
  const endTime = formData.get("endTime") as string
  const location = formData.get("location") as string
  const address = formData.get("address") as string
  const capacity = Number.parseInt(formData.get("capacity") as string)
  const price = Number.parseFloat(formData.get("price") as string) || 0
  const category = formData.get("category") as string
  const organizer = formData.get("organizer") as string
  const imageUrl = formData.get("imageUrl") as string
  const formType = (formData.get("formType") as string) || "event"
  const requirementsText = formData.get("requirements") as string
  const tagsText = formData.get("tags") as string
  const agendaText = formData.get("agenda") as string
  const featured = formData.get("featured") === "on"

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  // Process requirements
  const requirements = requirementsText ? requirementsText.split("\n").filter((req) => req.trim()) : []

  // Process tags
  const tags = tagsText
    ? tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    : []

  // Process agenda
  const agenda = agendaText
    ? agendaText
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [time, ...activityParts] = line.split(" - ")
          return {
            time: time?.trim() || "",
            activity: activityParts.join(" - ").trim() || line.trim(),
          }
        })
    : []

  const { data, error } = await supabaseAdmin
    .from("events")
    .insert({
      title,
      slug,
      description,
      long_description: longDescription || null,
      date,
      end_date: endDate || null,
      time: time || null,
      end_time: endTime || null,
      location,
      address: address || null,
      capacity,
      price,
      category,
      organizer: organizer || null,
      image_url: imageUrl || null,
      form_type: formType,
      requirements,
      tags,
      agenda,
      featured,
      registered: 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating event:", error)
    throw new Error("Failed to create event")
  }

  revalidatePath("/admin/udalosti")
  redirect("/admin/udalosti")
}

export async function updateEvent(eventId: string, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const longDescription = formData.get("longDescription") as string
  const date = formData.get("date") as string
  const endDate = formData.get("endDate") as string
  const time = formData.get("time") as string
  const endTime = formData.get("endTime") as string
  const location = formData.get("location") as string
  const address = formData.get("address") as string
  const capacity = Number.parseInt(formData.get("capacity") as string)
  const price = Number.parseFloat(formData.get("price") as string) || 0
  const category = formData.get("category") as string
  const organizer = formData.get("organizer") as string
  const imageUrl = formData.get("imageUrl") as string
  const formType = (formData.get("form_type") as string) || "event"
  const requirementsText = formData.get("requirements") as string
  const tagsText = formData.get("tags") as string
  const agendaText = formData.get("agenda") as string
  const featured = formData.get("featured") === "on"

  // Process requirements
  const requirements = requirementsText ? requirementsText.split("\n").filter((req) => req.trim()) : []

  // Process tags
  const tags = tagsText
    ? tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    : []

  // Process agenda
  const agenda = agendaText
    ? agendaText
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [time, ...activityParts] = line.split(" - ")
          return {
            time: time?.trim() || "",
            activity: activityParts.join(" - ").trim() || line.trim(),
          }
        })
    : []

  const { error } = await supabaseAdmin
    .from("events")
    .update({
      title,
      description,
      long_description: longDescription || null,
      date,
      end_date: endDate || null,
      time: time || null,
      end_time: endTime || null,
      location,
      address: address || null,
      capacity,
      price,
      category,
      organizer: organizer || null,
      image_url: imageUrl || null,
      form_type: formType,
      requirements,
      tags,
      agenda,
      featured,
    })
    .eq("id", eventId)

  if (error) {
    console.error("Error updating event:", error)
    throw new Error("Failed to update event")
  }

  revalidatePath("/admin/udalosti")
  revalidatePath(`/admin/udalosti/${eventId}/edit`)
  redirect("/admin/udalosti")
}

export async function deleteEvent(eventId: string) {
  const { error } = await supabaseAdmin.from("events").delete().eq("id", eventId)

  if (error) {
    console.error("Error deleting event:", error)
    throw new Error("Failed to delete event")
  }

  revalidatePath("/admin/udalosti")
}

export async function getRegistrationsForEvent(eventId: string) {
  const { data, error } = await supabaseAdmin
    .from("event_registrations")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching registrations:", error)
    return []
  }

  return data || []
}

export async function createEventReservation(formData: FormData) {
  const eventId = formData.get("eventId") as string
  const fullName = formData.get("fullName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const message = formData.get("message") as string

  const { data, error } = await supabaseAdmin
    .from("event_registrations")
    .insert({
      event_id: eventId,
      full_name: fullName,
      email,
      phone: phone || null,
      message: message || null,
      registration_type: "event",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating reservation:", error)
    throw new Error("Failed to create reservation")
  }

  // Update registered count
  const { error: updateError } = await supabaseAdmin.rpc("increment_event_registered", {
    event_id: eventId,
  })

  if (updateError) {
    console.error("Error updating registered count:", updateError)
  }

  revalidatePath(`/udalosti/${eventId}`)
  return data
}

export async function createCampRegistration(formData: FormData) {
  const eventId = formData.get("eventId") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const birthDate = formData.get("birthDate") as string
  const address = formData.get("address") as string
  const city = formData.get("city") as string
  const zipCode = formData.get("zipCode") as string
  const parentName = formData.get("parentName") as string
  const parentPhone = formData.get("parentPhone") as string
  const parentEmail = formData.get("parentEmail") as string
  const message = formData.get("message") as string
  const agreeToTerms = formData.get("agreeToTerms") === "on"
  const agreeToNewsletter = formData.get("agreeToNewsletter") === "on"
  const agreeToPhotos = formData.get("agreeToPhotos") === "on"

  const { data, error } = await supabaseAdmin
    .from("event_registrations")
    .insert({
      event_id: eventId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      birth_date: birthDate || null,
      address: address || null,
      city: city || null,
      zip_code: zipCode || null,
      parent_name: parentName || null,
      parent_phone: parentPhone || null,
      parent_email: parentEmail || null,
      message: message || null,
      agree_to_terms: agreeToTerms,
      agree_to_newsletter: agreeToNewsletter,
      agree_to_photos: agreeToPhotos,
      registration_type: "camp",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating camp registration:", error)
    throw new Error("Failed to create camp registration")
  }

  // Update registered count
  const { error: updateError } = await supabaseAdmin.rpc("increment_event_registered", {
    event_id: eventId,
  })

  if (updateError) {
    console.error("Error updating registered count:", updateError)
  }

  revalidatePath(`/udalosti/${eventId}`)
  return data
}
