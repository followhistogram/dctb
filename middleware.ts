import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ochrana admin rozhraní
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables not set')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Získání tokenu z cookies
    const token = request.cookies.get('sb-access-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Zde byste měli přidat kontrolu role uživatele
      // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      // if (profile?.role !== 'admin') {
      //   return NextResponse.redirect(new URL('/', request.url))
      // }

    } catch (error) {
      console.error('Auth check failed:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Rate limiting pro login stránku
  if (pathname === '/admin/login') {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    // Zde byste implementovali rate limiting logiku
    // např. pomocí Redis nebo in-memory store
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
