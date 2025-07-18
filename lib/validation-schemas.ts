import { z } from 'zod'

// Schema pro validaci článků
export const newsArticleSchema = z.object({
  title: z.string().min(1, 'Název je povinný').max(200, 'Název je příliš dlouhý'),
  perex: z.string().min(10, 'Perex musí mít alespoň 10 znaků').max(500, 'Perex je příliš dlouhý'),
  content: z.string().min(50, 'Obsah musí mít alespoň 50 znaků'),
  author: z.string().min(1, 'Autor je povinný').max(100, 'Jméno autora je příliš dlouhé'),
  category: z.string().min(1, 'Kategorie je povinná'),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url('Neplatná URL obrázku').optional().or(z.literal('')),
  featured: z.boolean().default(false),
  readTime: z.number().int().min(1, 'Čas čtení musí být alespoň 1 minuta').max(60, 'Čas čtení je příliš dlouhý')
})

// Schema pro validace událostí
export const eventSchema = z.object({
  title: z.string().min(1, 'Název je povinný').max(200, 'Název je příliš dlouhý'),
  description: z.string().min(10, 'Popis musí mít alespoň 10 znaků').max(1000, 'Popis je příliš dlouhý'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Neplatné datum'),
  location: z.string().min(1, 'Místo je povinné').max(200, 'Místo je příliš dlouhé'),
  capacity: z.number().int().min(1, 'Kapacita musí být alespoň 1').max(1000, 'Kapacita je příliš velká'),
  price: z.number().min(0, 'Cena nemůže být záporná').max(100000, 'Cena je příliš vysoká'),
  category: z.enum(['workshop', 'tábor', 'kurz', 'událost'], {
    errorMap: () => ({ message: 'Neplatná kategorie' })
  }),
  organizer: z.string().max(100, 'Jméno organizátora je příliš dlouhé').optional(),
  imageUrl: z.string().url('Neplatná URL obrázku').optional().or(z.literal('')),
  formType: z.enum(['event', 'camp'], {
    errorMap: () => ({ message: 'Neplatný typ formuláře' })
  }).default('event')
})

// Schema pro registraci na událost
export const eventRegistrationSchema = z.object({
  fullName: z.string().min(1, 'Jméno je povinné').max(100, 'Jméno je příliš dlouhé'),
  email: z.string().email('Neplatný email').max(100, 'Email je příliš dlouhý'),
  phone: z.string().regex(/^[+]?[0-9\s-()]{9,20}$/, 'Neplatné telefonní číslo').optional(),
  message: z.string().max(500, 'Zpráva je příliš dlouhá').optional()
})
