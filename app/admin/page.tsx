"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Mail, Shield, Heart } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

interface RateLimitState {
  isBlocked: boolean
  attempts: number
  blockUntil: number
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    isBlocked: false,
    attempts: 0,
    blockUntil: 0,
  })
  const router = useRouter()

  // Rate limiting - maximálně 5 pokusů za 15 minut
  const MAX_ATTEMPTS = 5
  const BLOCK_DURATION = 15 * 60 * 1000 // 15 minut

  useEffect(() => {
    // Kontrola, zda je uživatel již přihlášen
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push("/admin/dashboard")
      }
    }
    checkUser()

    // Načtení rate limit stavu z localStorage
    const savedRateLimit = localStorage.getItem("adminLoginRateLimit")
    if (savedRateLimit) {
      const parsed = JSON.parse(savedRateLimit)
      const now = Date.now()

      if (parsed.blockUntil > now) {
        setRateLimit(parsed)
      } else {
        // Vyčištění expirovaného bloku
        localStorage.removeItem("adminLoginRateLimit")
        setRateLimit({ isBlocked: false, attempts: 0, blockUntil: 0 })
      }
    }
  }, [router])

  useEffect(() => {
    // Automatické odblokovanie po uplynutí času
    if (rateLimit.isBlocked) {
      const timeout = setTimeout(() => {
        localStorage.removeItem("adminLoginRateLimit")
        setRateLimit({ isBlocked: false, attempts: 0, blockUntil: 0 })
        setError("")
      }, rateLimit.blockUntil - Date.now())

      return () => clearTimeout(timeout)
    }
  }, [rateLimit])

  const handleRateLimitCheck = () => {
    const now = Date.now()
    const newAttempts = rateLimit.attempts + 1

    if (newAttempts >= MAX_ATTEMPTS) {
      const blockUntil = now + BLOCK_DURATION
      const newRateLimit = { isBlocked: true, attempts: newAttempts, blockUntil }

      setRateLimit(newRateLimit)
      localStorage.setItem("adminLoginRateLimit", JSON.stringify(newRateLimit))

      const remainingMinutes = Math.ceil(BLOCK_DURATION / 60000)
      setError(`Příliš mnoho neúspěšných pokusů. Přístup blokován na ${remainingMinutes} minut.`)
      return false
    } else {
      const newRateLimit = { ...rateLimit, attempts: newAttempts }
      setRateLimit(newRateLimit)
      localStorage.setItem("adminLoginRateLimit", JSON.stringify(newRateLimit))
      return true
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rateLimit.isBlocked) {
      const remainingTime = Math.ceil((rateLimit.blockUntil - Date.now()) / 60000)
      setError(`Přístup je stále blokován. Zbývá ${remainingTime} minut.`)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Validace vstupů
      if (!email || !password) {
        setError("Prosím vyplňte všechna pole.")
        setIsLoading(false)
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Neplatný formát emailu.")
        setIsLoading(false)
        return
      }

      // Pokus o přihlášení
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (authError) {
        console.error("Chyba přihlášení:", authError)

        // Rate limiting jen při neúspěšném přihlášení
        if (!handleRateLimitCheck()) {
          setIsLoading(false)
          return
        }

        // Konkrétní chybové hlášky
        if (authError.message.includes("Invalid login credentials")) {
          setError("Neplatné přihlašovací údaje.")
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Email nebyl potvrzen.")
        } else {
          setError("Chyba při přihlášení. Zkuste to prosím znovu.")
        }

        setIsLoading(false)
        return
      }

      if (data.user) {
        // Kontrola admin role
        const { data: profile, error: profileError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .single()

        if (profileError || !profile || profile.role !== "admin") {
          await supabase.auth.signOut()
          setError("Nemáte oprávnění pro přístup do admin rozhraní.")
          setIsLoading(false)
          return
        }

        // Úspěšné přihlášení - vyčistit rate limit
        localStorage.removeItem("adminLoginRateLimit")
        setRateLimit({ isBlocked: false, attempts: 0, blockUntil: 0 })

        // Přesměrování na admin dashboard
        router.push("/admin/dashboard")
      }
    } catch (err) {
      console.error("Neočekávaná chyba:", err)
      setError("Došlo k neočekávané chybě. Zkuste to prosím znovu.")
    } finally {
      setIsLoading(false)
    }
  }

  const getRemainingTime = () => {
    if (!rateLimit.isBlocked) return 0
    return Math.ceil((rateLimit.blockUntil - Date.now()) / 60000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo a název */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#c13aab] to-[#00acb9] rounded-full flex items-center justify-center shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dělej co tě baví</h1>
          <p className="text-gray-600">Administrační rozhraní</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-[#c13aab]" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Přihlášení</CardTitle>
            <CardDescription className="text-gray-600">
              Zadejte své přihlašovací údaje pro přístup do administrace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || rateLimit.isBlocked}
                    className="pl-10 h-12 border-gray-200 focus:border-[#c13aab] focus:ring-[#c13aab]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Heslo
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || rateLimit.isBlocked}
                    className="pl-10 h-12 border-gray-200 focus:border-[#c13aab] focus:ring-[#c13aab]"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {rateLimit.isBlocked && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertDescription className="text-orange-800">
                    Přístup blokován na {getRemainingTime()} minut kvůli příliš mnoha neúspěšným pokusům.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#c13aab] to-[#00acb9] hover:from-[#a12d96] hover:to-[#008a94] text-white font-medium shadow-lg transition-all duration-200"
                disabled={isLoading || rateLimit.isBlocked}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Přihlašuji...
                  </>
                ) : (
                  "Přihlásit se"
                )}
              </Button>
            </form>

            {rateLimit.attempts > 0 && !rateLimit.isBlocked && (
              <div className="mt-4 text-sm text-gray-600 text-center bg-gray-50 p-3 rounded-lg">
                Zbývá {MAX_ATTEMPTS - rateLimit.attempts} pokusů
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; 2024 Dělej co tě baví. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </div>
  )
}
