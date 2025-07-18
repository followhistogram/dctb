import { getHeroContent } from "@/lib/hero-actions"
import { HeroForm } from "@/components/admin/hero-form"

export default async function HeroAdminPage() {
  const content = await getHeroContent()

  if (!content) {
    return <div>Chyba: Nepodařilo se načíst obsah hero sekce. Zkuste to prosím znovu.</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Správa Hero sekce</h1>
      <HeroForm content={content} />
    </div>
  )
}
