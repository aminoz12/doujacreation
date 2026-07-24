import { createClient } from '@supabase/supabase-js'

// Fall back to harmless placeholders so this module never throws at import time.
// `createClient` throws "supabaseUrl is required" on an empty string, which kills
// `next build` during its "collect page data" step whenever the env vars aren't
// present in the build environment (e.g. on Netlify before they're configured).
// Real values always take precedence; the placeholders only keep the build alive.
const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_KEY = 'placeholder-anon-key'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set — ' +
      'Supabase requests will fail until these environment variables are configured.'
  )
}

// Client for public operations (storefront, anon key, RLS-restricted)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

// Client for admin/server operations (service role — bypasses RLS).
// If the service key is missing we fall back to the anon client so the
// storefront still renders, but admin writes will then fail under RLS.
// We warn loudly rather than silently degrade.
if (!supabaseServiceKey) {
  console.warn(
    'SUPABASE_SERVICE_ROLE_KEY is not set — admin/server operations will fall back to the anon client and fail under RLS.'
  )
}

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : supabase

// Database types
export interface Admin {
  id: string
  username: string
  password_hash: string
  created_at: string
  updated_at: string
}

export interface Collection {
  id: string
  slug: string
  name_en: string
  name_fr: string
  description_en: string | null
  description_fr: string | null
  image_url: string | null
  meta_title_en: string | null
  meta_title_fr: string | null
  meta_description_en: string | null
  meta_description_fr: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  sku: string | null
  name_en: string
  name_fr: string
  description_en: string | null
  description_fr: string | null
  price_eur: number
  original_price_eur: number | null
  is_promotion: boolean
  promotion_start_date: string | null
  promotion_end_date: string | null
  promotion_label_en: string | null
  promotion_label_fr: string | null
  stock_quantity: number
  low_stock_threshold: number
  is_featured: boolean
  is_new: boolean
  status: 'draft' | 'published' | 'archived' | 'out_of_season'
  meta_title_en: string | null
  meta_title_fr: string | null
  meta_description_en: string | null
  meta_description_fr: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  color_id: string | null
  image_url: string
  display_order: number
  alt_text_en: string | null
  alt_text_fr: string | null
  created_at: string
}

export interface ProductSize {
  id: string
  product_id: string
  size: string
  stock_quantity: number
  price_adjustment: number
  display_order: number
  created_at: string
}

export interface ProductColor {
  id: string
  product_id: string
  name_en: string
  name_fr: string
  hex_code: string
  stock_quantity: number
  display_order: number
  created_at: string
}

export interface Tag {
  id: string
  name_en: string
  name_fr: string
  slug: string
  created_at: string
}

export interface CurrencyRate {
  id: string
  currency_code: string
  rate_from_eur: number
  symbol: string
  updated_at: string
}

export interface AdminSession {
  id: string
  admin_id: string
  token: string
  expires_at: string
  remember_me: boolean
  created_at: string
}

// Extended product with relations
export interface ProductWithRelations extends Product {
  images: ProductImage[]
  sizes: ProductSize[]
  colors: ProductColor[]
  collections: Collection[]
  tags: Tag[]
}


