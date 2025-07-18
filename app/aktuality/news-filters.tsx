"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface NewsFiltersProps {
  categories: string[]
  totalFound: number
}

export default function NewsFilters({ categories, totalFound }: NewsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "Všechny")

  useEffect(() => {
    const params = new URLSearchParams()

    if (searchTerm) {
      params.set("q", searchTerm)
    }

    if (selectedCategory && selectedCategory !== "Všechny") {
      params.set("category", selectedCategory)
    }

    const queryString = params.toString()
    const newUrl = queryString ? `/aktuality?${queryString}` : "/aktuality"

    router.push(newUrl)
  }, [searchTerm, selectedCategory, router])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Hledat aktuality..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
        </div>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm text-gray-600">
        Nalezeno {totalFound} {totalFound === 1 ? "aktualita" : "aktualit"}
      </div>
    </div>
  )
}
