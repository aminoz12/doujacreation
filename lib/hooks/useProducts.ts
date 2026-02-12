'use client'

import { useState, useEffect } from 'react'

export interface Product {
  id: string
  sku: string | null
  name: string
  name_en: string
  name_fr: string
  description: string
  description_en: string
  description_fr: string
  price: number
  originalPrice: number | null
  isPromotion: boolean
  promotionLabel: string | null
  stockQuantity: number
  isFeatured: boolean
  isNew: boolean
  images: string[]
  sizes: { size: string; stock: number; priceAdjustment: number }[]
  colors: { name: string; name_en: string; name_fr: string; hex: string; stock: number }[]
  collections: string[]
  tags: string[]
}

export interface Collection {
  id: string
  slug: string
  name: string
  name_en: string
  name_fr: string
  description: string
  description_en: string
  description_fr: string
  image: string | null
}

interface UseProductsOptions {
  collection?: string
  featured?: boolean
  isNew?: boolean
  limit?: number
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams()
        if (options.collection) params.set('collection', options.collection)
        if (options.featured) params.set('featured', 'true')
        if (options.isNew) params.set('new', 'true')
        if (options.limit) params.set('limit', options.limit.toString())

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()

        if (data.success) {
          setProducts(data.products)
        } else {
          setError(data.error || 'Failed to fetch products')
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError('Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [options.collection, options.featured, options.isNew, options.limit])

  return { products, loading, error }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        const data = await res.json()

        if (data.success) {
          setProduct(data.product)
        } else {
          setError(data.error || 'Product not found')
        }
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError('Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading, error }
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch('/api/collections')
        const data = await res.json()

        if (data.success) {
          setCollections(data.collections)
        } else {
          setError(data.error || 'Failed to fetch collections')
        }
      } catch (err) {
        console.error('Failed to fetch collections:', err)
        setError('Failed to fetch collections')
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  return { collections, loading, error }
}







