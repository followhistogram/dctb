import { ProjectForm } from "../project-form"

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nový projekt</h1>
        <p className="text-gray-600 mt-2">Vytvořte nový projekt pro zobrazení na webu</p>
      </div>

      <div className="max-w-4xl">
        <ProjectForm />
      </div>
    </div>
  )
}
