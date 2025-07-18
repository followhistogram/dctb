import { getHeroContent, type HeroContent } from "@/lib/hero-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const defaultContent: HeroContent = {
  id: "default",
  badge_text: "Nezisková organizace pro mladé",
  title: "Dělej co tě baví",
  subtitle:
    "Pomáháme mladým lidem najít svou cestu, rozvíjet talenty a realizovat své sny. Připojte se k naší komunitě a objevte nové možnosti.",
  button1_text: "Zjistit více",
  button1_link: "/o-nas",
  button2_text: "Nadcházející události",
  button2_link: "/udalosti",
  image_url: "/placeholder.svg?height=600&width=500",
  image_alt: "Mladí lidé pracující na kreativních projektech",
  stat1_value: "500+",
  stat1_label: "Aktivních členů",
  stat2_value: "50+",
  stat2_label: "Projektů ročně",
  stat3_value: "10",
  stat3_label: "Let působení",
}

export async function HeroSection() {
  const content = (await getHeroContent()) ?? defaultContent

  return (
    <section className="py-20 bg-gradient-to-br from-[#c13aab]/5 via-white to-[#00acb9]/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-[#00acb9]/10 text-[#00acb9] border-[#00acb9]/20">{content.badge_text}</Badge>
              <h1
                className="text-5xl lg:text-6xl font-bold text-[#111] leading-tight"
                dangerouslySetInnerHTML={{
                  __html: content.title.replace(
                    /baví/g,
                    '<span class="bg-gradient-to-r from-[#c13aab] to-[#00acb9] bg-clip-text text-transparent">baví</span>',
                  ),
                }}
              />
              <p className="text-xl text-gray-600 leading-relaxed">{content.subtitle}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white" asChild>
                <Link href={content.button1_link}>
                  {content.button1_text}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#00acb9] text-[#00acb9] hover:bg-[#00acb9] hover:text-white bg-transparent"
                asChild
              >
                <Link href={content.button2_link}>{content.button2_text}</Link>
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#111]">{content.stat1_value}</div>
                <div className="text-sm text-gray-600">{content.stat1_label}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#111]">{content.stat2_value}</div>
                <div className="text-sm text-gray-600">{content.stat2_label}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#111]">{content.stat3_value}</div>
                <div className="text-sm text-gray-600">{content.stat3_label}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c13aab]/20 to-[#00acb9]/20 rounded-3xl transform rotate-3"></div>
            <Image
              src={content.image_url ?? "/placeholder.svg?height=600&width=500"}
              alt={content.image_alt}
              width={500}
              height={600}
              className="relative rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
