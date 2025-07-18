import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "O nás",
  description: "Poznejte tým, který stojí za projektem Dělej co tě baví.",
}

interface TeamMember {
  id: string
  name: string
  position: string
  email: string | null
  image_url: string | null
}

export default async function AboutUsPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: contentData, error: contentError } = await supabase
    .from("about_us_content")
    .select("*")
    .single()

  const { data: teamData, error: teamError } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true })

  if (contentError) {
    console.error("Error fetching about us data:", contentError.message)
    // Optionally, you can render a more user-friendly error message
  }
  if (teamError) {
    console.error("Error fetching team data:", teamError.message)
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          {contentData?.title || "O nás"}
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          {contentData?.content || "Informace o naší organizaci se právě připravují."}
        </p>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Náš tým
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {(teamData as TeamMember[])?.map((member) => (
            <div key={member.id} className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={member.image_url || undefined} alt={member.name} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium text-gray-900">
                {member.name}
              </h3>
              <p className="text-gray-600">{member.position}</p>
              {member.email && (
                <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:underline">
                  {member.email}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
