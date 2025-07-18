"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Cookie, Settings } from "lucide-react"
import Link from "next/link"
import { getConsent, setConsent, type ConsentPreferences } from "@/lib/cookie-consent"
import { CookiePreferencesModal } from "./cookie-preferences-modal"

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  useEffect(() => {
    // Zkontrolujeme, zda už uživatel dal souhlas
    const consent = getConsent()
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    setConsent(allAccepted)
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const onlyNecessary: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    setConsent(onlyNecessary)
    setIsVisible(false)
  }

  const handleCustomize = () => {
    setShowPreferences(true)
  }

  const handlePreferencesSaved = () => {
    setShowPreferences(false)
    setIsVisible(false)
  }

  const handleClose = () => {
    // Pokud uživatel zavře banner bez výběru, nastavíme pouze nezbytné cookies
    handleRejectAll()
  }

  if (!isVisible) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/20 backdrop-blur-sm">
        <Card className="max-w-4xl mx-auto bg-white shadow-2xl border-0">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Cookie className="w-8 h-8 text-custom-pink" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Používáme cookies pro lepší zážitek</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Náš web používá cookies k zajištění základní funkčnosti, analýze návštěvnosti a personalizaci obsahu.
                  Kliknutím na "Přijmout vše" souhlasíte s používáním všech cookies. Více informací najdete v našich{" "}
                  <Link href="/zasady-ochrany-osobnich-udaju" className="text-custom-pink hover:underline font-medium">
                    zásadách ochrany osobních údajů
                  </Link>
                  .
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-custom-pink to-pink-600 hover:from-custom-pink/90 hover:to-pink-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Přijmout vše
                  </Button>
                  <Button
                    onClick={handleRejectAll}
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-custom-pink hover:text-custom-pink transition-all duration-300 bg-transparent"
                  >
                    Pouze nezbytné
                  </Button>
                  <Button
                    onClick={handleCustomize}
                    variant="outline"
                    className="border-2 border-custom-cyan text-custom-cyan hover:bg-custom-cyan hover:text-white transition-all duration-300 bg-transparent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Přizpůsobit
                  </Button>
                  <Link href="/sprava-cookies">
                    <Button
                      variant="ghost"
                      className="text-gray-600 hover:text-custom-pink transition-colors w-full sm:w-auto"
                    >
                      Spravovat cookies
                    </Button>
                  </Link>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Zavřít"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <CookiePreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSave={handlePreferencesSaved}
        initialPreferences={{
          necessary: true,
          analytics: false,
          marketing: false,
        }}
      />
    </>
  )
}
