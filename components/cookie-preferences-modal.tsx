"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, BarChart3, Target } from "lucide-react"
import type { ConsentPreferences } from "@/lib/cookie-consent"
import { setConsent } from "@/lib/cookie-consent"

interface CookiePreferencesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  initialPreferences: ConsentPreferences
}

export function CookiePreferencesModal({ isOpen, onClose, onSave, initialPreferences }: CookiePreferencesModalProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences>(initialPreferences)

  const handleSave = () => {
    setConsent(preferences)
    onSave()
  }

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    setPreferences(allAccepted)
    setConsent(allAccepted)
    onSave()
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    setPreferences(onlyNecessary)
    setConsent(onlyNecessary)
    onSave()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Přizpůsobit preference cookies</DialogTitle>
          <DialogDescription>
            Vyberte si, které typy cookies chcete povolit. Vaše volba bude uložena a respektována při všech budoucích
            návštěvách.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Necessary Cookies */}
          <div className="flex items-start justify-between p-4 rounded-lg border-2 border-green-200 bg-green-50/50">
            <div className="flex items-start space-x-3 flex-1">
              <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="necessary-cookies" className="font-bold text-base">
                    Nezbytné cookies
                  </Label>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    Vždy aktivní
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Tyto cookies jsou nezbytné pro základní fungování webu a nelze je vypnout.
                </p>
              </div>
            </div>
            <Switch id="necessary-cookies" checked disabled className="mt-1" />
          </div>

          {/* Analytics Cookies */}
          <div className="flex items-start justify-between p-4 rounded-lg border-2 hover:border-blue-200 transition-colors">
            <div className="flex items-start space-x-3 flex-1">
              <BarChart3 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="analytics-cookies" className="font-bold text-base">
                    Analytické cookies
                  </Label>
                  <Badge variant={preferences.analytics ? "default" : "secondary"} className="text-xs">
                    {preferences.analytics ? "Povoleno" : "Zakázáno"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Pomáhají nám měřit návštěvnost a analyzovat, jak návštěvníci používají náš web.
                </p>
                <div className="text-xs text-gray-500">Příklady: Google Analytics, měření výkonu stránek</div>
              </div>
            </div>
            <Switch
              id="analytics-cookies"
              checked={preferences.analytics}
              onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
              className="mt-1"
            />
          </div>

          {/* Marketing Cookies */}
          <div className="flex items-start justify-between p-4 rounded-lg border-2 hover:border-purple-200 transition-colors">
            <div className="flex items-start space-x-3 flex-1">
              <Target className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="marketing-cookies" className="font-bold text-base">
                    Marketingové cookies
                  </Label>
                  <Badge variant={preferences.marketing ? "default" : "secondary"} className="text-xs">
                    {preferences.marketing ? "Povoleno" : "Zakázáno"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Používají se k zobrazování relevantních reklam a sledování marketingových kampaní.
                </p>
                <div className="text-xs text-gray-500">Příklady: Facebook Pixel, Google Ads, remarketing</div>
              </div>
            </div>
            <Switch
              id="marketing-cookies"
              checked={preferences.marketing}
              onCheckedChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full">
            <Button
              onClick={handleRejectAll}
              variant="outline"
              className="flex-1 border-2 border-gray-300 hover:border-custom-pink hover:text-custom-pink transition-all duration-300 bg-transparent"
            >
              Pouze nezbytné
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="flex-1 bg-gradient-to-r from-custom-pink to-pink-600 hover:from-custom-pink/90 hover:to-pink-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Přijmout vše
            </Button>
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-custom-cyan to-cyan-600 hover:from-custom-cyan/90 hover:to-cyan-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Uložit vlastní nastavení
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
