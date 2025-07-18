import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Calendar,
  BookOpen,
  Camera,
  Mic,
  Palette,
  Code,
  Globe,
  FolderKanban,
  Target,
  Lightbulb,
} from "lucide-react"
import Image from "next/image"
import { supabaseAdmin } from "@/lib/supabase-server"
import Link from "next/link"

const iconMap: { [key: string]: React.ElementType } = {
  Heart,
  Users,
  Star,
  Palette,
  Camera,
  BookOpen,
  Mic,
  Code,
  Globe,
  FolderKanban,
  Target,
  Lightbulb,
}

const ProjectIcon = ({ name }: { name?: string | null }) => {
  const IconComponent = name && iconMap[name] ? iconMap[name] : FolderKanban
  return <IconComponent className="w-8 h-8 text-white" />
}

const AdditionalProjectIcon = ({ name }: { name?: string | null }) => {
  const IconComponent = name && iconMap[name] ? iconMap[name] : FolderKanban
  return <IconComponent className="w-6 h-6 text-[#c13aab]" />
}

const stats = [
  { number: "1000+", label: "Ovlivněných životů", icon: Target },
  { number: "15", label: "Aktivních projektů", icon: Lightbulb },
  { number: "50+", label: "Partnerských škol", icon: Users },
  { number: "10", label: "Let zkušeností", icon: Star },
]

async function getProjects() {
  try {
    const { data, error } = await supabaseAdmin.from("projects").select("*").order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }
    return data || []
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export default async function ProjectsPage() {
  const allProjects = await getProjects()
  const mainProjects = allProjects.filter((p) => p.type === "main")
  const additionalProjects = allProjects.filter((p) => p.type === "additional")

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-[#111] via-[#111] to-[#222] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#c13aab] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00acb9] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            <Badge className="bg-[#c13aab]/20 text-[#c13aab] border-[#c13aab]/30 text-base px-4 py-2">
              Naše projekty
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Měníme svět{" "}
              <span className="bg-gradient-to-r from-[#c13aab] to-[#00acb9] bg-clip-text text-transparent">
                projekt za projektem
              </span>{" "}
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Každý náš projekt má jedinečný přístup, ale všechny spojuje společný cíl - pomáhat mladým lidem růst,
              rozvíjet se a najít své místo ve světě. Objevte naši práci a staňte se součástí změny.
            </p>
          </div>

          {/* Stats */}
          
        </div>
      </section>

      {/* Main Projects */}
      {mainProjects.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#111] mb-4">Naše hlavní projekty</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Pilíře naší práce, které definují naši identitu a poslání
              </p>
            </div>

            <div className="space-y-24">
              {mainProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
                >
                  <div className={`space-y-8 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center shadow-lg"
                          style={{
                            background: project.color
                              ? `linear-gradient(to right, ${project.color}, ${project.color}80)`
                              : "linear-gradient(to right, #c13aab, #c13aab80)",
                          }}
                        >
                          <ProjectIcon name={project.icon} />
                        </div>
                        <div>
                          {project.category && (
                            <Badge className="bg-gray-100 text-gray-700 mb-2">{project.category}</Badge>
                          )}
                          <h3 className="text-3xl font-bold text-[#111]">{project.title}</h3>
                          {project.subtitle && <p className="text-lg text-gray-600">{project.subtitle}</p>}
                        </div>
                      </div>
                    </div>

                    {project.long_description && (
                      <p className="text-lg text-gray-700 leading-relaxed">{project.long_description}</p>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {project.impact && (
                        <div className="space-y-2">
                          <div className="font-semibold text-[#111]">Dopad projektu</div>
                          <div className="text-gray-600">{project.impact}</div>
                        </div>
                      )}
                      {project.duration && (
                        <div className="space-y-2">
                          <div className="font-semibold text-[#111]">Doba trvání</div>
                          <div className="text-gray-600">{project.duration}</div>
                        </div>
                      )}
                    </div>

                    {project.features && project.features.length > 0 && (
                      <div className="space-y-4">
                        <div className="font-semibold text-[#111]">Klíčové vlastnosti:</div>
                        <div className="grid md:grid-cols-2 gap-2">
                          {project.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-[#00acb9] flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#c13aab] to-[#00acb9] hover:from-[#c13aab]/90 hover:to-[#00acb9]/90 text-white"
                      asChild
                    >
                      <Link href={project.project_link || `/projekty/${project.slug}`}>
                        Zjistit více o projektu
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className={`relative ${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#c13aab]/20 to-[#00acb9]/20 rounded-3xl transform rotate-3"></div>
                    <Image
                      src={project.image_url || "/placeholder.svg?height=400&width=600"}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="relative rounded-3xl object-cover shadow-2xl w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Projects */}
      {additionalProjects.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#111] mb-4">Další projekty a aktivity</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Široké spektrum aktivit a workshopů pro rozvoj různých dovedností a zájmů
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {additionalProjects.map((project, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#c13aab]/10 to-[#00acb9]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <AdditionalProjectIcon name={project.icon} />
                      </div>
                      {project.category && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          {project.category}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-[#111] group-hover:text-[#c13aab] transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project.short_description && (
                      <CardDescription className="text-base mb-4 leading-relaxed">
                        {project.short_description}
                      </CardDescription>
                    )}
                    <div className="flex items-center justify-between">
                      {project.impact && <span className="text-sm text-gray-600">{project.impact}</span>}
                      <Button variant="ghost" size="sm" className="text-[#c13aab] hover:text-[#c13aab]/80" asChild>
                        <Link href={project.project_link || `/projekty/${project.slug}`}>
                          Zjistit více <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How to Get Involved */}
      <section className="py-24 bg-gradient-to-r from-[#111] to-[#222]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Jak se zapojit</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Existuje mnoho způsobů, jak se můžete stát součástí našich projektů
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-white/10 backdrop-blur-sm text-center hover:bg-white/20 transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#c13aab] rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Staňte se účastníkem</h3>
                <p className="text-gray-300 mb-6">
                  Přihlaste se k našim workshopům, táborům nebo konferencím a rozvíjejte své dovednosti.
                </p>
                <Button className="bg-[#c13aab] hover:bg-[#c13aab]/90 text-white">Prohlédnout události</Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/10 backdrop-blur-sm text-center hover:bg-white/20 transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#00acb9] rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Staňte se dobrovolníkem</h3>
                <p className="text-gray-300 mb-6">
                  Pomozte nám organizovat akce a projekty. Vaše zkušenosti a nadšení jsou pro nás cenné.
                </p>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#111] bg-transparent"
                >
                  Přihlásit se
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/10 backdrop-blur-sm text-center hover:bg-white/20 transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#c13aab] to-[#00acb9] rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Staňte se partnerem</h3>
                <p className="text-gray-300 mb-6">
                  Spolupracujte s námi na dlouhodobých projektech a pomozte nám rozšířit náš dopad.
                </p>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#111] bg-transparent"
                >
                  Kontaktovat nás
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#c13aab] to-[#00acb9]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">Připojte se k naší misi</h2>
            <p className="text-xl text-white/90">
              Každý projekt začíná jedním krokem. Udělejte ten svůj a staňte se součástí pozitivní změny.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#c13aab] hover:bg-white/90">
                Prohlédnout události
                <Calendar className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#c13aab] bg-transparent"
              >
                Kontaktujte nás
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
