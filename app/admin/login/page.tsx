import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Lock, Mail, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [blocked, setBlocked] = useState(false)
  const [blockTime, setBlockTime] = useState(0)
  const router = useRouter()

  // Rate limiting
  useEffect(() => {
    const storedAttempts = localStorage.getItem('login_attempts')
    const lastAttempt = localStorage.getItem('last_attempt')

    if (storedAttempts && lastAttempt) {
      const attemptCount = parseInt(storedAttempts)
      const lastAttemptTime = parseInt(lastAttempt)
      const now = Date.now()

      // Resetovat pokusy po 15 minutách
      if (now - lastAttemptTime > 15 * 60 * 1000) {
        localStorage.removeItem('login_attempts')
        localStorage.removeItem('last_attempt')
        setAttempts(0)
      } else {
        setAttempts(attemptCount)

        // Blokovat po 5 pokusech
        if (attemptCount >= 5) {
          setBlocked(true)
          const remainingTime = Math.max(0, 15 * 60 * 1000 - (now - lastAttemptTime))
          setBlockTime(remainingTime)

          const timer = setInterval(() => {
            setBlockTime(prev => {
              if (prev <= 1000) {
                setBlocked(false)
                setAttempts(0)
                localStorage.removeItem('login_attempts')
                localStorage.removeItem('last_attempt')
                clearInterval(timer)
                return 0
              }
              return prev - 1000
            })
          }, 1000)

          return () => clearInterval(timer)
        }
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (blocked) {
      setError('Příliš mnoho pokusů o přihlášení. Zkuste to později.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        localStorage.setItem('login_attempts', newAttempts.toString())
        localStorage.setItem('last_attempt', Date.now().toString())

        if (newAttempts >= 5) {
          setBlocked(true)
          setBlockTime(15 * 60 * 1000)
        }

        setError('Neplatné přihlašovací údaje')
        return
      }

      if (data.user) {
        // Vymazat pokusy při úspěšném přihlášení
        localStorage.removeItem('login_attempts')
        localStorage.removeItem('last_attempt')

        // Redirect to admin dashboard
        router.push('/admin')
      }
    } catch (err) {
      setError('Došlo k chybě při přihlašování')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-cyan-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#c13aab] to-[#00acb9]">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Administrace
          </CardTitle>
          <CardDescription className="text-gray-600">
            Přihlaste se do administračního rozhraní
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {blocked && (
              <Alert variant="destructive">
                <AlertDescription>
                  Příliš mnoho pokusů o přihlášení. Zkuste to znovu za {formatTime(blockTime)}.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@delejcotebavi.com"
                  className="pl-10"
                  required
                  disabled={blocked}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  disabled={blocked}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || blocked}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Přihlašuji...
                </>
              ) : (
                'Přihlásit se'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Zbývá pokusů: {Math.max(0, 5 - attempts)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
