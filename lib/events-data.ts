import { supabaseAdmin } from "./supabase-server"

export interface Event {
  id: string
  title: string
  description: string
  longDescription: string
  date: string
  time: string
  endTime: string
  location: string
  address: string
  capacity: number
  registered: number
  price: number
  category: string
  image: string
  organizer: string
  requirements?: string[]
  agenda?: { time: string; activity: string }[]
  tags: string[]
  featured: boolean
}

export const events: Event[] = [
  {
    id: "bike-camp-2025",
    title: "Příměstský tábor BIKE CAMP",
    description: "Týdenní dobrodružství na kolech pro děti a mládež ve věku 8-16 let.",
    longDescription:
      "Příměstský tábor BIKE CAMP je určen pro všechny mladé cyklisty, kteří chtějí zlepšit své dovednosti na kole a prožít nezapomenutelné prázdniny. Během pěti dnů se naučíte základy bezpečné jízdy, zvládnete technické prvky a projdete se po nejkrásnějších stezkách v okolí Prahy. Tábor je veden zkušenými instruktory a je vhodný jak pro začátečníky, tak pro pokročilé.",
    date: "2025-08-11",
    time: "08:00",
    endTime: "16:00",
    location: "Bike park Letná",
    address: "Letenské sady, Praha 7",
    capacity: 24,
    registered: 18,
    price: 4900,
    category: "Tábor",
    image: "/placeholder.svg?height=400&width=600",
    organizer: "Tomáš Novotný",
    requirements: [
      "Vlastní kolo v dobrém technickém stavu",
      "Cyklistická helma (povinná)",
      "Sportovní oblečení a obuv",
      "Pláštěnka nebo nepromokavá bunda",
      "Láhev na pití",
      "Svačina na každý den",
    ],
    agenda: [
      { time: "08:00-08:30", activity: "Příchod a ranní rozcvička" },
      { time: "08:30-10:00", activity: "Technické dovednosti - brždění a zatáčení" },
      { time: "10:00-10:15", activity: "Přestávka" },
      { time: "10:15-11:45", activity: "Jízda v terénu - základy" },
      { time: "11:45-12:30", activity: "Oběd" },
      { time: "12:30-14:00", activity: "Výlet na kolech po okolí" },
      { time: "14:00-14:15", activity: "Svačina" },
      { time: "14:15-15:30", activity: "Hry a soutěže na kolech" },
      { time: "15:30-16:00", activity: "Závěrečné hodnocení dne" },
    ],
    tags: ["cyklistika", "tábor", "děti", "sport", "příroda"],
    featured: true,
  },
  {
    id: "1",
    title: "Kreativní psaní pro začátečníky",
    description: "Objevte sílu slov a naučte se vyjadřovat své myšlenky kreativním způsobem.",
    longDescription:
      "Tento workshop je určen pro všechny, kteří chtějí začít s kreativním psaním nebo si zlepšit své dovednosti. Během tří hodin se naučíte základní techniky, prozkoumáte různé žánry a vytvoříte své první texty pod vedením zkušené spisovatelky.",
    date: "2024-12-22",
    time: "14:00",
    endTime: "17:00",
    location: "Komunitní centrum",
    address: "Náměstí Míru 15, Praha 2",
    capacity: 20,
    registered: 15,
    price: 0,
    category: "Workshop",
    image: "/placeholder.svg?height=400&width=600",
    organizer: "Marie Nováková",
    requirements: ["Zápisník a pero", "Chuť experimentovat", "Žádné předchozí zkušenosti nejsou nutné"],
    agenda: [
      { time: "14:00-14:30", activity: "Úvod a seznámení" },
      { time: "14:30-15:30", activity: "Základní techniky kreativního psaní" },
      { time: "15:30-15:45", activity: "Přestávka" },
      { time: "15:45-16:30", activity: "Praktické cvičení - tvorba krátkého textu" },
      { time: "16:30-17:00", activity: "Sdílení a zpětná vazba" },
    ],
    tags: ["kreativita", "psaní", "začátečníci"],
    featured: true,
  },
  {
    id: "2",
    title: "Fotografický workshop - Portrétní fotografie",
    description: "Naučte se fotografovat portréty jako profesionál.",
    longDescription:
      "Intenzivní workshop zaměřený na portrétní fotografii. Naučíte se pracovat se světlem, kompozicí a komunikací s modelem. Workshop kombinuje teorii s praktickými cvičeními.",
    date: "2024-12-28",
    time: "10:00",
    endTime: "16:00",
    location: "Fotografické studio",
    address: "Wenceslas Square 1, Praha 1",
    capacity: 12,
    registered: 8,
    price: 500,
    category: "Workshop",
    image: "/placeholder.svg?height=400&width=600",
    organizer: "Tomáš Svoboda",
    requirements: ["Vlastní fotoaparát (DSLR nebo mirrorless)", "Základní znalost ovládání fotoaparátu"],
    agenda: [
      { time: "10:00-10:30", activity: "Úvod do portrétní fotografie" },
      { time: "10:30-12:00", activity: "Práce se světlem - teorie a praxe" },
      { time: "12:00-13:00", activity: "Oběd" },
      { time: "13:00-14:30", activity: "Kompozice a komunikace s modelem" },
      { time: "14:30-16:00", activity: "Praktické fotografování" },
    ],
    tags: ["fotografie", "portrét", "pokročilí"],
    featured: true,
  },
  {
    id: "3",
    title: "Podnikání pro mladé - Jak začít",
    description: "Praktický seminář o zakládání vlastního podnikání.",
    longDescription:
      "Seminář určený mladým lidem, kteří uvažují o vlastním podnikání. Projdeme si celý proces od nápadu po realizaci, včetně právních aspektů a financování.",
    date: "2025-01-05",
    time: "09:00",
    endTime: "17:00",
    location: "Business centrum",
    address: "Karlovo náměstí 10, Praha 2",
    capacity: 30,
    registered: 22,
    price: 200,
    category: "Seminář",
    image: "/placeholder.svg?height=400&width=600",
    organizer: "Ing. Pavel Novák",
    requirements: ["Vlastní nápad na podnikání (nepovinné)", "Zápisník"],
    agenda: [
      { time: "09:00-10:30", activity: "Od nápadu k business plánu" },
      { time: "10:30-10:45", activity: "Přestávka" },
      { time: "10:45-12:00", activity: "Právní aspekty podnikání" },
      { time: "12:00-13:00", activity: "Oběd" },
      { time: "13:00-14:30", activity: "Financování a granty" },
      { time: "14:30-14:45", activity: "Přestávka" },
      { time: "14:45-16:00", activity: "Marketing a prodej" },
      { time: "16:00-17:00", activity: "Q&A a networking" },
    ],
    tags: ["podnikání", "business", "finance"],
    featured: false,
  },
]

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id)
}

export function getUpcomingEvents(): Event[] {
  const now = new Date()
  return events.filter((event) => new Date(event.date) >= now)
}

export function getFeaturedEvents(): Event[] {
  return events.filter((event) => event.featured)
}

export async function getLatestEvents(limit: number) {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .gte("date", new Date().toISOString()) // gte = greater than or equal to today
    .order("date", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching latest events:", error)
    return []
  }

  return data || []
}
