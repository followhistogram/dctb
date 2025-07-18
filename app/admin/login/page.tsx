"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Mail } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError("Neplatné přihlašovací údaje")
        return
      }

      if (data.user) {
        // Redirect to admin dashboard
        router.push("/admin")
      }
    } catch (err) {
      setError("Došlo k chybě při přihlašování")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c13aab]/10 to-[#00acb9]/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#c13aab] to-[#00acb9] rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl text-[#111]">Administrace</CardTitle>
            <CardDescription>Přihlaste se do administračního rozhraní</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#111]">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@delejcotebavi.com"
                  className="pl-10 border-gray-300 focus:border-[#c13aab] focus:ring-[#c13aab]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#111]">
                Heslo
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 border-gray-300 focus:border-[#c13aab] focus:ring-[#c13aab]"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Přihlašuji...
                </>
              ) : (
                "Přihlásit se"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Zapomněli jste heslo?{" "}
              <button
                onClick={async () => {
                  if (email) {
                    await supabase.auth.resetPasswordForEmail(email)
                    alert("Odkaz pro obnovení hesla byl odeslán na váš email")
                  } else {
                    alert("Nejprve zadejte svůj email")
                  }
                }}
                className="text-[#c13aab] hover:underline"
              >
                Obnovit heslo
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
