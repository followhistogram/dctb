import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">
          <FileText className="w-24 h-24 text-gray-300 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-[#111]">Aktualita nenalezena</h1>
        <p className="text-gray-600">Omlouváme se, ale aktualita kterou hledáte neexistuje nebo byla odstraněna.</p>
        <div className="space-y-3">
          <Link href="/aktuality">
            <Button className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zpět na aktuality
            </Button>
          </Link>
          <div>
            <Link href="/" className="text-[#00acb9] hover:underline text-sm">
              Nebo se vraťte na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
