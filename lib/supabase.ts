import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client for admin operations (server-side only)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
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
  price_mad: number
  original_price_mad: number | null
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
  rate_from_mad: number
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

