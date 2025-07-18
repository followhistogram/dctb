import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="py-20 bg-gradient-to-br from-[#c13aab]/10 to-[#00acb9]/10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="w-24 h-8 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
            <div className="w-96 h-16 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
            <div className="w-full max-w-3xl h-6 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg"></div>
                <CardHeader className="pb-4">
                  <div className="w-20 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-full h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
