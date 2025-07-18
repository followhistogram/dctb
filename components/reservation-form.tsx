"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, MessageSquare, AlertCircle, CheckCircle } from "lucide-react"
import { createEventReservation } from "@/lib/events-actions"

interface ReservationFormProps {
  event: {
    id: string
    title: string
    date: string
    price: number
  }
}

export function ReservationForm({ event }: ReservationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await createEventReservation(event.id, formData)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Reset form
        const form = document.getElementById("reservation-form") as HTMLFormElement
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
        <CardTitle className="text-xl text-[#111]">Rezervace místa</CardTitle>
        <p className="text-sm text-gray-600">Vyplňte formulář pro rezervaci na {event.title}</p>
      </CardHeader>
      <CardContent>
        <form id="reservation-form" action={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#111] flex items-center">
              <User className="w-4 h-4 mr-2 text-[#c13aab]" />
              Osobní údaje
            </h3>
            <div>
              <Label htmlFor="name">Jméno a příjmení *</Label>
              <Input id="name" name="name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Telefon *</Label>
              <Input id="phone" name="phone" type="tel" required className="mt-1" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#111] flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-[#c13aab]" />
              Zpráva
            </h3>
            <div>
              <Label htmlFor="message">Dodatečné informace (volitelné)</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Zde můžete uvést jakékoliv dotazy nebo speciální požadavky..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-3">
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
            {isSubmitting ? "Odesílám..." : `Rezervovat místo (${event.price === 0 ? "Zdarma" : `${event.price} Kč`})`}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Po odeslání rezervace vám bude zaslán potvrzovací email s dalšími instrukcemi.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
