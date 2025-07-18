import { supabaseAdmin } from "@/lib/supabase-server"
import { ProjectForm } from "../../project-form"
import { notFound } from "next/navigation"

async function getProject(id: string) {
  try {
    const { data, error } = await supabaseAdmin.from("projects").select("*").eq("id", id).single()

    if (error || !data) {
      return null
    }
    return data
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upravit projekt</h1>
        <p className="text-gray-600 mt-2">Upravte informace o projektu "{project.title}"</p>
      </div>

      <div className="max-w-4xl">
        <ProjectForm project={project} />
      </div>
    </div>
  )
}
