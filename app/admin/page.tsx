"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Eye, TrendingUp, Calendar, Star, User } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import Link from "next/link"

interface DashboardStats {
  totalNews: number
  totalEvents: number
  totalPartners: number
  totalTestimonials: number
  recentArticles: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalEvents: 0,
    totalPartners: 0,
    totalTestimonials: 0,
    recentArticles: [],
  })
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadDashboardData()
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  const loadDashboardData = async () => {
    try {
      const [
        { count: totalNews },
        { count: totalEvents },
        { count: totalPartners },
        { count: totalTestimonials },
        { data: recentArticles },
      ] = await Promise.all([
        supabase.from("news_articles").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("partners").select("*", { count: "exact", head: true }),
        supabase.from("testimonials").select("*", { count: "exact", head: true }),
        supabase.from("news_articles").select("*").order("created_at", { ascending: false }).limit(5),
      ])

      setStats({
        totalNews: totalNews || 0,
        totalEvents: totalEvents || 0,
        totalPartners: totalPartners || 0,
        totalTestimonials: totalTestimonials || 0,
        recentArticles: recentArticles || [],
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-full h-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111]">Přehled administrace</h1>
        <p className="text-gray-600 mt-2">
          Vítejte v administračním rozhraní,{" "}
          {currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "admin"}!
        </p>
      </div>

      {/* User Info Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-[#c13aab]/5 to-[#00acb9]/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#c13aab] to-[#00acb9] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#111]">Přihlášený uživatel</h3>
              <p className="text-gray-600">{currentUser?.email}</p>
              <p className="text-sm text-gray-500">
                Poslední přihlášení: {new Date(currentUser?.last_sign_in_at).toLocaleString("cs-CZ")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Počet aktualit</p>
                <p className="text-3xl font-bold text-[#111]">{stats.totalNews}</p>
              </div>
              <div className="w-12 h-12 bg-[#c13aab]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#c13aab]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Počet událostí</p>
                <p className="text-3xl font-bold text-[#111]">{stats.totalEvents}</p>
              </div>
              <div className="w-12 h-12 bg-[#00acb9]/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#00acb9]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Počet partnerů</p>
                <p className="text-3xl font-bold text-[#111]">{stats.totalPartners}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Počet referencí</p>
                <p className="text-3xl font-bold text-[#111]">{stats.totalTestimonials}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-[#111]">
              <Calendar className="w-5 h-5 mr-2" />
              Nejnovější články
            </CardTitle>
            <CardDescription>Posledních 5 publikovaných článků</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/aktuality/${article.id}/edit`}
                      className="font-medium text-[#111] hover:text-[#c13aab] transition-colors line-clamp-1"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                      {article.featured && <Badge className="bg-[#c13aab] text-white text-xs">Hlavní</Badge>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(article.created_at).toLocaleDateString("cs-CZ")} • {article.author}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recentArticles.length === 0 && (
                <p className="text-gray-500 text-center py-4">Žádné články zatím nebyly vytvořeny</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-[#111]">
              <Users className="w-5 h-5 mr-2" />
              Rychlé akce
            </CardTitle>
            <CardDescription>Nejčastěji používané funkce</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/admin/aktuality/new"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-[#c13aab] hover:bg-[#c13aab]/5 transition-colors group"
              >
                <div className="w-10 h-10 bg-[#c13aab]/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#c13aab]/20">
                  <FileText className="w-5 h-5 text-[#c13aab]" />
                </div>
                <div>
                  <p className="font-medium text-[#111]">Nový článek</p>
                  <p className="text-sm text-gray-600">Vytvořit novou aktualitu</p>
                </div>
              </Link>

              <Link
                href="/admin/aktuality"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-[#00acb9] hover:bg-[#00acb9]/5 transition-colors group"
              >
                <div className="w-10 h-10 bg-[#00acb9]/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#00acb9]/20">
                  <Eye className="w-5 h-5 text-[#00acb9]" />
                </div>
                <div>
                  <p className="font-medium text-[#111]">Správa článků</p>
                  <p className="text-sm text-gray-600">Editovat existující články</p>
                </div>
              </Link>

              <Link
                href="/aktuality"
                target="_blank"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-[#111]">Zobrazit web</p>
                  <p className="text-sm text-gray-600">Otevřít veřejné stránky</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
