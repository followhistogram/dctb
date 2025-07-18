import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"

export default function EventNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="text-8xl mb-6">📅</div>
            <h1 className="text-4xl font-bold text-[#111] mb-4">Událost nenalezena</h1>
            <p className="text-xl text-gray-600 mb-8">
              Omlouváme se, ale událost, kterou hledáte, neexistuje nebo byla odstraněna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/udalosti">
                <Button className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Zobrazit všechny události
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zpět na hlavní stránku
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
