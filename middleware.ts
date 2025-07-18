import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase konfiguracija
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Přeskočení middleware pro statické soubory a API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Kontrola admin routes
  if (pathname.startsWith('/admin')) {
    // Získání access tokenu z cookie
    const token = request.cookies.get('sb-access-token')?.value ||
                 request.cookies.get('supabase-auth-token')?.value

    if (!token) {
      // Žádný token - přesměrovat na login
      if (pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      return NextResponse.next()
    }

    try {
      // Ověření tokenu
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        // Neplatný token - přesměrovat na login
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('sb-access-token')
        response.cookies.delete('supabase-auth-token')
        return response
      }

      // Kontrola admin role
      const { data: profile, error: profileError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (profileError || !profile || profile.role !== 'admin') {
        // Uživatel nemá admin oprávnění
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Pokud je uživatel přihlášen a na login stránce, přesměrovat na admin
      if (pathname === '/admin/login') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      // Pokračovat k admin stránce
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware chyba:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
