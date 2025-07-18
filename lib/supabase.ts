// lib/supabase-client.ts

import { createClient } from "@supabase/supabase-js";

// Environment proměnné musí být nastavené v .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Vytvoření klienta pro Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Typy databázových objektů
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  perex: string;
  content: string;
  published_at: string;
  author: string;
  category: string;
  tags: string[];
  image_url: string | null;
  featured: boolean;
  read_time: number;
  created_at: string;
  updated_at: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
}
