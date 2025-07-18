import { getHeroContent, updateHeroContent } from "@/lib/hero-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export default async function HeroAdminPage() {
  const content = await getHeroContent()

  if (!content) {
    return <div>Chyba: Nepodařilo se načíst obsah hero sekce. Zkuste to prosím znovu.</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Správa Hero sekce</h1>
      <form action={updateHeroContent}>
        <input type="hidden" name="id" value={content.id} />
        <Card>
          <CardHeader>
            <CardTitle>Hlavní obsah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="badge_text">Text odznaku</Label>
              <Input id="badge_text" name="badge_text" defaultValue={content.badge_text} />
            </div>
            <div>
              <Label htmlFor="title">Titulek</Label>
              <Input id="title" name="title" defaultValue={content.title} />
            </div>
            <div>
              <Label htmlFor="subtitle">Podtitulek</Label>
              <Textarea id="subtitle" name="subtitle" defaultValue={content.subtitle} rows={4} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tlačítka</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Tlačítko 1</h3>
              <div>
                <Label htmlFor="button1_text">Text</Label>
                <Input id="button1_text" name="button1_text" defaultValue={content.button1_text} />
              </div>
              <div>
                <Label htmlFor="button1_link">Odkaz</Label>
                <Input id="button1_link" name="button1_link" defaultValue={content.button1_link} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Tlačítko 2</h3>
              <div>
                <Label htmlFor="button2_text">Text</Label>
                <Input id="button2_text" name="button2_text" defaultValue={content.button2_text} />
              </div>
              <div>
                <Label htmlFor="button2_link">Odkaz</Label>
                <Input id="button2_link" name="button2_link" defaultValue={content.button2_link} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Obrázek a statistiky</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image_url">URL obrázku</Label>
              <Input id="image_url" name="image_url" defaultValue={content.image_url ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_alt">Alternativní text obrázku</Label>
              <Input id="image_alt" name="image_alt" defaultValue={content.image_alt} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stat1_value">Statistika 1 - Hodnota</Label>
                <Input id="stat1_value" name="stat1_value" defaultValue={content.stat1_value} />
                <Label htmlFor="stat1_label">Statistika 1 - Popisek</Label>
                <Input id="stat1_label" name="stat1_label" defaultValue={content.stat1_label} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat2_value">Statistika 2 - Hodnota</Label>
                <Input id="stat2_value" name="stat2_value" defaultValue={content.stat2_value} />
                <Label htmlFor="stat2_label">Statistika 2 - Popisek</Label>
                <Input id="stat2_label" name="stat2_label" defaultValue={content.stat2_label} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat3_value">Statistika 3 - Hodnota</Label>
                <Input id="stat3_value" name="stat3_value" defaultValue={content.stat3_value} />
                <Label htmlFor="stat3_label">Statistika 3 - Popisek</Label>
                <Input id="stat3_label" name="stat3_label" defaultValue={content.stat3_label} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> Uložit změny
          </Button>
        </div>
      </form>
    </div>
  )
}
