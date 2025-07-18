"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Settings, Shield, BarChart3, Target } from "lucide-react"
import { getConsent, setConsent, type ConsentPreferences } from "@/lib/cookie-consent"
import { toast } from "sonner"

export default function CookieManagementPage() {
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const currentConsent = getConsent()
    if (currentConsent) {
      setPreferences(currentConsent)
    }
    setIsLoaded(true)
  }, [])

  const handlePreferenceChange = (key: keyof ConsentPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    setHasChanges(true)
  }

  const handleSave = () => {
    setConsent(preferences)
    setHasChanges(false)
    toast.success("Vaše preference cookies byly úspěšně uloženy!")
  }

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    setPreferences(allAccepted)
    setConsent(allAccepted)
    setHasChanges(false)
    toast.success("Všechny cookies byly povoleny!")
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    setPreferences(onlyNecessary)
    setConsent(onlyNecessary)
    setHasChanges(false)
    toast.success("Pouze nezbytné cookies jsou povoleny!")
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-custom-pink"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Settings className="w-12 h-12 text-custom-pink" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Správa cookies</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Spravujte své preference pro soubory cookie a rozhodněte se, jaké informace chcete sdílet pro zlepšení
            vašeho zážitku na našem webu.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={handleAcceptAll}
            className="flex-1 bg-gradient-to-r from-custom-pink to-pink-600 hover:from-custom-pink/90 hover:to-pink-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Povolit všechny cookies
          </Button>
          <Button
            onClick={handleRejectAll}
            variant="outline"
            className="flex-1 border-2 border-gray-300 hover:border-custom-pink hover:text-custom-pink transition-all duration-300 bg-transparent"
          >
            Povolit pouze nezbytné
          </Button>
        </div>

        {/* Cookie Categories */}
        <div className="space-y-6">
          {/* Necessary Cookies */}
          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <div>
                    <CardTitle className="text-xl">Nezbytné cookies</CardTitle>
                    <CardDescription>Tyto soubory cookie jsou nezbytné pro základní fungování webu</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Vždy aktivní
                  </Badge>
                  <Switch checked disabled />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Nezbytné cookies umožňují základní funkce jako navigace po stránkách a přístup k zabezpečeným oblastem
                webu. Web nemůže bez těchto cookies správně fungovat.
              </p>
              <div className="bg-white p-3 rounded-lg border">
                <h4 className="font-semibold text-sm mb-2">Příklady použití:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Uchování přihlašovacích údajů</li>
                  <li>• Zabezpečení formulářů</li>
                  <li>• Základní funkce webu</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Cookies */}
          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-xl">Analytické cookies</CardTitle>
                    <CardDescription>Pomáhají nám pochopit, jak návštěvníci používají náš web</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={preferences.analytics ? "default" : "secondary"}>
                    {preferences.analytics ? "Povoleno" : "Zakázáno"}
                  </Badge>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Analytické cookies nám pomáhají pochopit, jak návštěvníci interagují s webem, shromažďováním a hlášením
                informací anonymně.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <h4 className="font-semibold text-sm mb-2">Příklady použití:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Měření návštěvnosti stránek</li>
                  <li>• Analýza chování uživatelů</li>
                  <li>• Zlepšování výkonu webu</li>
                  <li>• Google Analytics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Cookies */}
          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-purple-600" />
                  <div>
                    <CardTitle className="text-xl">Marketingové cookies</CardTitle>
                    <CardDescription>Používají se k zobrazování relevantních reklam</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={preferences.marketing ? "default" : "secondary"}>
                    {preferences.marketing ? "Povoleno" : "Zakázáno"}
                  </Badge>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Marketingové cookies se používají k sledování návštěvníků napříč weby. Záměrem je zobrazovat reklamy,
                které jsou relevantní a poutavé pro jednotlivé uživatele.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <h4 className="font-semibold text-sm mb-2">Příklady použití:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Personalizované reklamy</li>
                  <li>• Sledování konverzí</li>
                  <li>• Remarketing kampaně</li>
                  <li>• Sociální sítě</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">Máte neuložené změny</h3>
                <p className="text-sm text-yellow-700">Nezapomeňte uložit své preference cookies.</p>
              </div>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-custom-pink to-pink-600 hover:from-custom-pink/90 hover:to-pink-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Uložit změny
              </Button>
            </div>
          </div>
        )}

        <Separator className="my-12" />

        {/* Additional Information */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Další informace</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              <strong>Jak dlouho jsou cookies uloženy?</strong> Doba uložení se liší podle typu cookie. Některé jsou
              odstraněny po ukončení relace prohlížeče, jiné mohou být uloženy až jeden rok.
            </p>
            <p>
              <strong>Můžu změnit své preference později?</strong> Ano, své preference můžete kdykoli změnit návštěvou
              této stránky nebo kliknutím na odkaz "Správa cookies" v patičce webu.
            </p>
            <p>
              <strong>Co se stane, když cookies zakážu?</strong> Zakázání některých cookies může ovlivnit funkčnost webu
              a váš uživatelský zážitek.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
