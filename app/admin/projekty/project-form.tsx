"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProject, updateProject } from "@/lib/projects-actions"

type Project = {
  id: string
  title: string
  subtitle?: string | null
  slug: string
  short_description?: string | null
  long_description?: string | null
  impact?: string | null
  duration?: string | null
  features?: string[] | null
  project_link?: string | null
  icon?: string | null
  color?: string | null
  category?: string | null
  type: string
}

export function ProjectForm({ project }: { project?: Project }) {
  const action = project ? updateProject.bind(null, project.id) : createProject
  const [state, formAction] = useActionState(action, { message: "", errors: {} })

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Název</Label>
          <Input id="title" name="title" defaultValue={project?.title} required />
          {state.errors?.title && <p className="text-red-500 text-sm">{state.errors.title}</p>}
        </div>
        <div>
          <Label htmlFor="subtitle">Podtitul</Label>
          <Input id="subtitle" name="subtitle" defaultValue={project?.subtitle ?? ""} />
        </div>
        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input id="slug" name="slug" defaultValue={project?.slug} required />
          {state.errors?.slug && <p className="text-red-500 text-sm">{state.errors.slug}</p>}
        </div>
        <div>
          <Label htmlFor="category">Kategorie</Label>
          <Input id="category" name="category" defaultValue={project?.category ?? ""} />
        </div>
        <div>
          <Label htmlFor="type">Typ projektu</Label>
          <Select name="type" defaultValue={project?.type ?? "main"}>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte typ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Hlavní</SelectItem>
              <SelectItem value="additional">Doplňkový</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="project_link">Odkaz na projekt</Label>
          <Input id="project_link" name="project_link" defaultValue={project?.project_link ?? ""} />
        </div>
      </div>

      <div>
        <Label htmlFor="short_description">Krátký popis</Label>
        <Textarea id="short_description" name="short_description" defaultValue={project?.short_description ?? ""} />
      </div>
      <div>
        <Label htmlFor="long_description">Dlouhý popis</Label>
        <Textarea
          id="long_description"
          name="long_description"
          rows={5}
          defaultValue={project?.long_description ?? ""}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="impact">Dopad projektu</Label>
          <Input id="impact" name="impact" defaultValue={project?.impact ?? ""} />
        </div>
        <div>
          <Label htmlFor="duration">Doba trvání</Label>
          <Input id="duration" name="duration" defaultValue={project?.duration ?? ""} />
        </div>
      </div>

      <div>
        <Label htmlFor="features">Klíčové vlastnosti (oddělené čárkou)</Label>
        <Input id="features" name="features" defaultValue={project?.features?.join(", ") ?? ""} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="icon">Ikona (název z Lucide)</Label>
          <Input id="icon" name="icon" defaultValue={project?.icon ?? ""} />
        </div>
        <div>
          <Label htmlFor="color">Barva (gradient from)</Label>
          <Input id="color" name="color" defaultValue={project?.color ?? ""} />
        </div>
      </div>

      <Button type="submit">{project ? "Uložit změny" : "Vytvořit projekt"}</Button>
      {state.message && <p className="text-red-500 text-sm">{state.message}</p>}
    </form>
  )
}
