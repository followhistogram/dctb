"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Mail, MapPin, MessageSquare, AlertCircle, CheckCircle } from "lucide-react"
import { createCampRegistration } from "@/lib/events-actions"

interface CampRegistrationFormProps {
  event: {
    id: string
    title: string
    date: string
    end_date?: string
    price: number
  }
}

export function CampRegistrationForm({ event }: CampRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await createCampRegistration(event.id, formData)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Reset form
        const form = document.getElementById("camp-registration-form") as HTMLFormElement
        form?.reset()
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Došlo k neočekávané chybě. Zkuste to prosím znovu." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-[#111]">Registrace na tábor</CardTitle>
        <p className="text-sm text-gray-600">Vyplňte formulář pro registraci na {event.title}</p>
      </CardHeader>
      <CardContent>
        <form id="camp-registration-form" action={handleSubmit} className="space-y-6">
          {/* Participant Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#111] flex items-center">
              <User className="w-4 h-4 mr-2 text-[#c13aab]" />
              Údaje účastníka
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Jméno *</Label>
                <Input id="firstName" name="firstName" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">Příjmení *</Label>
                <Input id="lastName" name="lastName" required className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="birthDate">Datum narození *</Label>
              <Input id="birthDate" name="birthDate" type="date" required className="mt-1" />
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#111] flex items-center">
              <Mail className="w-4 h-4 mr-2 text-[#c13aab]" />
              Kontaktní údaje
            </h3>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Telefon *</Label>
              <Input id="phone" name="phone" type="tel" required className="mt-1" />
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#111] flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-[#c13aab]" />
              Adresa
            </h3>
            <div>
              <Label htmlFor="address">Ulice a číslo popisné *</Label>
              <Input id="address" name="address" required className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Město *</Label>
                <Input id="city" name="city" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="zipCode">PSČ *</Label>
                <Input id="zipCode" name="zipCode" required className="mt-1" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Parent/Guardian Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#111] flex items-center">
              <User className="w-4 h-4 mr-2 text-[#c13aab]" />
              Zákonný zástupce
            </h3>
            <div>
              <Label htmlFor="parentName">Jméno a příjmení *</Label>
              <Input id="parentName" name="parentName" required className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentPhone">Telefon *</Label>
                <Input id="parentPhone" name="parentPhone" type="tel" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="parentEmail">Email</Label>
                <Input id="parentEmail" name="parentEmail" type="email" className="mt-1" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Message */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#111] flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-[#c13aab]" />
              Dodatečné informace
            </h3>
            <div>
              <Label htmlFor="message">Zpráva (volitelné)</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Zde můžete uvést jakékoliv dodatečné informace, speciální požadavky nebo dotazy..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>

          <Separator />

          {/* Agreements */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="agreeToTerms" name="agreeToTerms" value="true" required />
              <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                Souhlasím s{" "}
                <a href="/podminky" className="text-[#c13aab] hover:underline">
                  obchodními podmínkami
                </a>{" "}
                a{" "}
                <a href="/ochrana-osobnich-udaju" className="text-[#c13aab] hover:underline">
                  zpracováním osobních údajů
                </a>
                . *
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="agreeToNewsletter" name="agreeToNewsletter" value="true" />
              <Label htmlFor="agreeToNewsletter" className="text-sm">
                Souhlasím se zasíláním novinek a informací o dalších akcích
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="agreeToPhotos" name="agreeToPhotos" value="true" />
              <Label htmlFor="agreeToPhotos" className="text-sm">
                Souhlasím s pořizováním a použitím fotografií z akce pro propagační účely
              </Label>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-lg flex items-center space-x-2 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#c13aab] hover:bg-[#c13aab]/90 text-white py-3"
          >
            {isSubmitting
              ? "Odesílám..."
              : `Registrovat na tábor (${event.price === 0 ? "Zdarma" : `${event.price} Kč`})`}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Po odeslání registrace vám bude zaslán potvrzovací email s dalšími instrukcemi.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
