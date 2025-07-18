"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Settings, ImageIcon, Search, Tag } from "lucide-react"
import { getSiteSettings, updateSiteSettings, type SiteSettings } from "@/lib/settings-actions"

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    logo_url: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await getSiteSettings()
      setSettings(data)
    } catch (error) {
      console.error("Error loading settings:", error)
      setMessage({ type: "error", text: "Nepodařilo se načíst nastavení" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const result = await updateSiteSettings({
        logo_url: settings.logo_url,
        seo_title: settings.seo_title,
        seo_description: settings.seo_description,
        seo_keywords: settings.seo_keywords,
      })

      if (result.success) {
        setMessage({ type: "success", text: "Nastavení bylo úspěšně uloženo" })
      } else {
        setMessage({ type: "error", text: result.error || "Nepodařilo se uložit nastavení" })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      setMessage({ type: "error", text: "Nepodařilo se uložit nastavení" })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Nastavení webu
        </h1>
        <p className="text-muted-foreground mt-2">Spravujte základní nastavení webu včetně loga a SEO údajů</p>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
        >
          <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Logo webu
            </CardTitle>
            <CardDescription>Zadejte URL adresu loga, které se zobrazí v hlavičce webu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="logo_url">URL loga</Label>
              <Input
                id="logo_url"
                type="url"
                placeholder="https://example.com/logo.png"
                value={settings.logo_url}
                onChange={(e) => handleInputChange("logo_url", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Doporučená velikost: 120x40 pixelů. Podporované formáty: PNG, JPG, SVG
              </p>
              {settings.logo_url && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm font-medium mb-2">Náhled:</p>
                  <img
                    src={settings.logo_url || "/placeholder.svg"}
                    alt="Logo náhled"
                    className="h-10 max-w-[120px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEO nastavení
            </CardTitle>
            <CardDescription>Nastavte základní SEO údaje pro lepší viditelnost ve vyhledávačích</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo_title">Titulek webu</Label>
              <Input
                id="seo_title"
                placeholder="Dělej co tě baví"
                value={settings.seo_title}
                onChange={(e) => handleInputChange("seo_title", e.target.value)}
                maxLength={60}
              />
              <p className="text-sm text-muted-foreground">Hlavní titulek webu (doporučeno max. 60 znaků)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_description">Popis webu</Label>
              <Textarea
                id="seo_description"
                placeholder="Organizace zaměřená na rozvoj dětí a mládeže..."
                value={settings.seo_description}
                onChange={(e) => handleInputChange("seo_description", e.target.value)}
                maxLength={160}
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Krátký popis webu pro vyhledávače (doporučeno max. 160 znaků)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_keywords" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Klíčová slova
              </Label>
              <Input
                id="seo_keywords"
                placeholder="děti, mládež, aktivity, projekty"
                value={settings.seo_keywords}
                onChange={(e) => handleInputChange("seo_keywords", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Klíčová slova oddělená čárkami (pro SEO účely)</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="min-w-[120px]">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ukládám...
              </>
            ) : (
              "Uložit nastavení"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
