import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-server"
import { deleteProject } from "@/lib/projects-actions"

async function getProjects() {
  try {
    const { data, error } = await supabaseAdmin.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }
    return data || []
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export default async function ProjectsAdminPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Správa projektů</h1>
          <p className="text-gray-600 mt-2">Spravujte projekty zobrazené na stránce /projekty</p>
        </div>
        <Button asChild>
          <Link href="/admin/projekty/new">
            <Plus className="w-4 h-4 mr-2" />
            Nový projekt
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">Zatím nemáte žádné projekty.</p>
            <Button asChild>
              <Link href="/admin/projekty/new">
                <Plus className="w-4 h-4 mr-2" />
                Vytvořit první projekt
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={project.type === "main" ? "default" : "secondary"}>
                    {project.type === "main" ? "Hlavní" : "Doplňkový"}
                  </Badge>
                  {project.category && <Badge variant="outline">{project.category}</Badge>}
                </div>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                {project.subtitle && <CardDescription>{project.subtitle}</CardDescription>}
              </CardHeader>
              <CardContent>
                {project.short_description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.short_description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/projekty/edit/${project.id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Upravit
                      </Link>
                    </Button>
                    <form action={deleteProject.bind(null, project.id)}>
                      <Button size="sm" variant="destructive" type="submit">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Smazat
                      </Button>
                    </form>
                  </div>
                  {project.project_link && (
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={project.project_link} target="_blank">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
