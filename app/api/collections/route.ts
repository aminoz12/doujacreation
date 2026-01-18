import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET active collections for frontend
export async function GET() {
  try {
    const { data: collections, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) throw error

    // Transform collections for frontend
    const transformedCollections = (collections || []).map(collection => ({
      id: collection.id,
      slug: collection.slug,
      name: collection.name_en,
      name_en: collection.name_en,
      name_fr: collection.name_fr,
      description: collection.description_en,
      description_en: collection.description_en,
      description_fr: collection.description_fr,
      image: collection.image_url,
      metaTitle_en: collection.meta_title_en,
      metaTitle_fr: collection.meta_title_fr,
      metaDescription_en: collection.meta_description_en,
      metaDescription_fr: collection.meta_description_fr
    }))

    return NextResponse.json({ success: true, collections: transformedCollections })
  } catch (error) {
    console.error('Collections API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}






