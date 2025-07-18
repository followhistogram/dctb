"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "./supabase-server"
import { FormData } from "next/server"

// Aktualizace hlavního obsahu
export async function updateAboutUsContent(formData: FormData) {
  const id = formData.get("id") as string;
  const content = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  const { error } = await supabaseAdmin.from("about_us_content").update(content).eq("id", id);

  if (error) {
    console.error("Error updating about us content:", error);
    return { success: false, message: "Nepodařilo se aktualizovat obsah." };
  }

  revalidatePath("/o-nas");
  revalidatePath("/admin/o-nas");
  return { success: true, message: "Obsah byl úspěšně aktualizován." };
}

// Přidání člena týmu
export async function addTeamMember(formData: FormData) {
  const member = {
    name: formData.get("name") as string,
    position: formData.get("position") as string,
    email: (formData.get("email") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    display_order: parseInt(formData.get("display_order") as string, 10) || 0,
  };

  const { error } = await supabaseAdmin.from("team_members").insert(member);

  if (error) {
    console.error("Error adding team member:", error);
    return { success: false, message: "Nepodařilo se přidat člena." };
  }

  revalidatePath("/o-nas");
  revalidatePath("/admin/o-nas");
  return { success: true, message: "Člen byl úspěšně přidán." };
}

// Aktualizace člena týmu
export async function updateTeamMember(formData: FormData) {
  const id = formData.get("id") as string;
  const member = {
    name: formData.get("name") as string,
    position: formData.get("position") as string,
    email: (formData.get("email") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    display_order: parseInt(formData.get("display_order") as string, 10) || 0,
  };

  const { error } = await supabaseAdmin.from("team_members").update(member).eq("id", id);

  if (error) {
    console.error("Error updating team member:", error);
    return { success: false, message: "Nepodařilo se aktualizovat člena." };
  }

  revalidatePath("/o-nas");
  revalidatePath("/admin/o-nas");
  return { success: true, message: "Člen byl úspěšně aktualizován." };
}

// Smazání člena týmu
export async function deleteTeamMember(formData: FormData) {
  const id = formData.get("id") as string;

  const { error } = await supabaseAdmin.from("team_members").delete().eq("id", id);

  if (error) {
    console.error("Error deleting team member:", error);
    return { success: false, message: "Nepodařilo se smazat člena." };
  }

  revalidatePath("/o-nas");
  revalidatePath("/admin/o-nas");
  return { success: true, message: "Člen byl úspěšně smazán." };
}
