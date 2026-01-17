'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Save, Trash2, Upload, X, Plus, GripVertical,
  Calendar, Percent, Star, Sparkles, Package
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Collection, Tag, ProductImage, ProductSize, ProductColor } from '@/lib/supabase'

interface ProductFormData {
  sku: string
  name_en: string
  name_fr: string
  description_en: string
  description_fr: string
  price_eur: number
  original_price_eur: number | null
  is_promotion: boolean
  promotion_start_date: string
  promotion_end_date: string
  promotion_label_en: string
  promotion_label_fr: string
  stock_quantity: number
  low_stock_threshold: number
  is_featured: boolean
  is_new: boolean
  status: 'draft' | 'published' | 'archived' | 'out_of_season'
  meta_title_en: string
  meta_title_fr: string
  meta_description_en: string
  meta_description_fr: string
  display_order: number
}

interface ImageData {
  id?: string
  url: string
  display_order: number
  alt_text_en: string
  alt_text_fr: string
  isNew?: boolean
}

interface SizeData {
  id?: string
  size: string
  stock_quantity: number
  price_adjustment: number
  display_order: number
}

interface ColorData {
  id?: string
  name_en: string
  name_fr: string
  hex_code: string
  stock_quantity: number
  display_order: number
}

const initialFormData: ProductFormData = {
  sku: '',
  name_en: '',
  name_fr: '',
  description_en: '',
  description_fr: '',
  price_eur: 0,
  original_price_eur: null,
  is_promotion: false,
  promotion_start_date: '',
  promotion_end_date: '',
  promotion_label_en: '',
  promotion_label_fr: '',
  stock_quantity: 0,
  low_stock_threshold: 5,
  is_featured: false,
  is_new: false,
  status: 'draft',
  meta_title_en: '',
  meta_title_fr: '',
  meta_description_en: '',
  meta_description_fr: '',
  display_order: 0
}

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ProductEditPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const isNew = id === 'new'
  
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [images, setImages] = useState<ImageData[]>([])
  const [sizes, setSizes] = useState<SizeData[]>([])
  const [colors, setColors] = useState<ColorData[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  const [allCollections, setAllCollections] = useState<Collection[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('basic')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchCollectionsAndTags()
    if (!isNew) {
      fetchProduct()
    }
  }, [id, isNew])

  const fetchCollectionsAndTags = async () => {
    try {
      const [collectionsRes, tagsRes] = await Promise.all([
        fetch('/api/admin/collections'),
        fetch('/api/admin/tags')
      ])
      const collectionsData = await collectionsRes.json()
      const tagsData = await tagsRes.json()
      
      if (collectionsData.success) setAllCollections(collectionsData.collections)
      if (tagsData.success) setAllTags(tagsData.tags)
    } catch (error) {
      console.error('Échec du chargement des collections/tags:', error)
    }
  }

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${id}`)
      const data = await res.json()
      
      if (data.success && data.product) {
        const p = data.product
        setFormData({
          sku: p.sku || '',
          name_en: p.name_en || '',
          name_fr: p.name_fr || '',
          description_en: p.description_en || '',
          description_fr: p.description_fr || '',
          price_eur: p.price_eur || 0,
          original_price_eur: p.original_price_eur,
          is_promotion: p.is_promotion || false,
          promotion_start_date: p.promotion_start_date || '',
          promotion_end_date: p.promotion_end_date || '',
          promotion_label_en: p.promotion_label_en || '',
          promotion_label_fr: p.promotion_label_fr || '',
          stock_quantity: p.stock_quantity || 0,
          low_stock_threshold: p.low_stock_threshold || 5,
          is_featured: p.is_featured || false,
          is_new: p.is_new || false,
          status: p.status || 'draft',
          meta_title_en: p.meta_title_en || '',
          meta_title_fr: p.meta_title_fr || '',
          meta_description_en: p.meta_description_en || '',
          meta_description_fr: p.meta_description_fr || '',
          display_order: p.display_order || 0
        })
        
        // Set images
        if (p.product_images) {
          setImages(p.product_images.map((img: ProductImage) => ({
            id: img.id,
            url: img.image_url,
            display_order: img.display_order,
            alt_text_en: img.alt_text_en || '',
            alt_text_fr: img.alt_text_fr || ''
          })))
        }
        
        // Set sizes
        if (p.product_sizes) {
          setSizes(p.product_sizes.map((s: ProductSize) => ({
            id: s.id,
            size: s.size,
            stock_quantity: s.stock_quantity,
            price_adjustment: s.price_adjustment,
            display_order: s.display_order
          })))
        }
        
        // Set colors
        if (p.product_colors) {
          setColors(p.product_colors.map((c: ProductColor) => ({
            id: c.id,
            name_en: c.name_en,
            name_fr: c.name_fr,
            hex_code: c.hex_code,
            stock_quantity: c.stock_quantity,
            display_order: c.display_order
          })))
        }
        
        // Set collections
        if (p.product_collections) {
          setSelectedCollections(p.product_collections.map((pc: { collection_id: string }) => pc.collection_id))
        }
        
        // Set tags
        if (p.product_tags) {
          setSelectedTags(p.product_tags.map((pt: { tag_id: string }) => pt.tag_id))
        }
      }
    } catch (error) {
      console.error('Échec du chargement du produit:', error)
      setError('Impossible de charger le produit')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || images.length >= 5) return

    setUploading(true)
    
    for (let i = 0; i < Math.min(files.length, 5 - images.length); i++) {
      const file = files[i]
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('folder', 'products')

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataUpload
        })
        const data = await res.json()
        if (data.success) {
          setImages(prev => [...prev, {
            url: data.url,
            display_order: prev.length,
            alt_text_en: '',
            alt_text_fr: '',
            isNew: true
          }])
        }
      } catch (error) {
        console.error('Erreur de téléchargement:', error)
      }
    }
    
    setUploading(false)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, display_order: i })))
  }

  const addSize = () => {
    setSizes(prev => [...prev, {
      size: '',
      stock_quantity: 0,
      price_adjustment: 0,
      display_order: prev.length
    }])
  }

  const updateSize = (index: number, field: keyof SizeData, value: string | number) => {
    setSizes(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const removeSize = (index: number) => {
    setSizes(prev => prev.filter((_, i) => i !== index))
  }

  const addColor = () => {
    setColors(prev => [...prev, {
      name_en: '',
      name_fr: '',
      hex_code: '#000000',
      stock_quantity: 0,
      display_order: prev.length
    }])
  }

  const updateColor = (index: number, field: keyof ColorData, value: string | number) => {
    setColors(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c))
  }

  const removeColor = (index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index))
  }

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = {
        ...formData,
        original_price_eur: formData.is_promotion ? formData.original_price_eur : null,
        images: images.map((img, i) => ({
          id: img.id,
          image_url: img.url,
          display_order: i,
          alt_text_en: img.alt_text_en,
          alt_text_fr: img.alt_text_fr
        })),
        sizes,
        colors,
        collections: selectedCollections,
        tags: selectedTags
      }

      const url = isNew ? '/api/admin/products' : `/api/admin/products/${id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/products')
      } else {
        setError(data.error || 'Échec de l\'enregistrement du produit')
      }
    } catch (error) {
      console.error('Erreur d\'enregistrement:', error)
      setError('Échec de l\'enregistrement du produit')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        router.push('/admin/products')
      } else {
        setError(data.error || 'Échec de la suppression du produit')
      }
    } catch (error) {
      console.error('Erreur de suppression:', error)
      setError('Échec de la suppression du produit')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'basic', label: 'Informations', icon: <Package size={18} /> },
    { id: 'media', label: 'Images', icon: <Upload size={18} /> },
    { id: 'pricing', label: 'Prix & Stock', icon: <Percent size={18} /> },
    { id: 'variants', label: 'Variantes', icon: <Sparkles size={18} /> },
    { id: 'organization', label: 'Organisation', icon: <Star size={18} /> },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            href="/admin/products"
            className="mr-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNew ? 'Nouveau Produit' : 'Modifier le Produit'}
            </h1>
            {!isNew && formData.sku && (
              <p className="text-slate-400 text-sm mt-1">SKU: {formData.sku}</p>
            )}
          </div>
        </div>
        {!isNew && (
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 size={18} className="mr-2" />
            Supprimer
          </button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-700 mb-6 -mx-4 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Informations de Base</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nom (Anglais) *
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nom (Français) *
                  </label>
                  <input
                    type="text"
                    name="name_fr"
                    value={formData.name_fr}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  placeholder="ex: CAF-001"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description (Anglais)
                  </label>
                  <textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description (Français)
                  </label>
                  <textarea
                    name="description_fr"
                    value={formData.description_fr}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Paramètres SEO</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Titre Meta (Anglais)
                  </label>
                  <input
                    type="text"
                    name="meta_title_en"
                    value={formData.meta_title_en}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Titre Meta (Français)
                  </label>
                  <input
                    type="text"
                    name="meta_title_fr"
                    value={formData.meta_title_fr}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description Meta (Anglais)
                  </label>
                  <textarea
                    name="meta_description_en"
                    value={formData.meta_description_en}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description Meta (Français)
                  </label>
                  <textarea
                    name="meta_description_fr"
                    value={formData.meta_description_fr}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Images du Produit</h2>
              <span className="text-sm text-slate-400">{images.length}/5 images</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-slate-700 group">
                  <Image
                    src={image.url}
                    alt={`Produit ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-amber-500 text-xs font-medium text-slate-900 rounded">
                      Principal
                    </span>
                  )}
                </div>
              ))}
              
              {images.length < 5 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-slate-600 hover:border-amber-500/50 cursor-pointer flex flex-col items-center justify-center transition-colors">
                  <Upload size={24} className="text-slate-500 mb-2" />
                  <span className="text-xs text-slate-500">
                    {uploading ? 'Téléchargement...' : 'Ajouter une Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <p className="text-xs text-slate-500">
              Glissez pour réorganiser. La première image sera l&apos;image principale du produit. Max 5 images, 5Mo chacune.
            </p>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Tarification</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Prix (EUR) *
                  </label>
                  <input
                    type="number"
                    name="price_eur"
                    value={formData.price_eur}
                    onChange={handleChange}
                    required
                    min={0}
                    step={0.01}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex items-center pt-7">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_promotion"
                      checked={formData.is_promotion}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    <span className="ml-3 text-sm font-medium text-slate-300">En Promotion</span>
                  </label>
                </div>
              </div>

              {formData.is_promotion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-slate-700"
                >
                  <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                    <Percent size={16} className="mr-2 text-green-500" />
                    Paramètres de Promotion
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Prix Original (EUR) - Affiché barré
                      </label>
                      <input
                        type="number"
                        name="original_price_eur"
                        value={formData.original_price_eur || ''}
                        onChange={handleChange}
                        min={0}
                        step={0.01}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Date de Début</label>
                        <input
                          type="date"
                          name="promotion_start_date"
                          value={formData.promotion_start_date}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Date de Fin</label>
                        <input
                          type="date"
                          name="promotion_end_date"
                          value={formData.promotion_end_date}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Libellé Promo (EN)
                      </label>
                      <input
                        type="text"
                        name="promotion_label_en"
                        value={formData.promotion_label_en}
                        onChange={handleChange}
                        placeholder="ex: 30% OFF"
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Libellé Promo (FR)
                      </label>
                      <input
                        type="text"
                        name="promotion_label_fr"
                        value={formData.promotion_label_fr}
                        onChange={handleChange}
                        placeholder="ex: -30%"
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Inventaire</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Quantité en Stock
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Seuil d&apos;Alerte Stock Bas
                  </label>
                  <input
                    type="number"
                    name="low_stock_threshold"
                    value={formData.low_stock_threshold}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Vous serez alerté lorsque le stock descend en dessous de ce nombre
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Variants Tab */}
        {activeTab === 'variants' && (
          <div className="space-y-6">
            {/* Sizes */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Tailles</h2>
                <button
                  type="button"
                  onClick={addSize}
                  className="flex items-center px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Ajouter une Taille
                </button>
              </div>

              {sizes.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="mb-3">Aucune taille ajoutée</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {defaultSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSizes(prev => [...prev, {
                          size,
                          stock_quantity: 0,
                          price_adjustment: 0,
                          display_order: prev.length
                        }])}
                        className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
                      >
                        + {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {sizes.map((size, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <input
                        type="text"
                        value={size.size}
                        onChange={(e) => updateSize(index, 'size', e.target.value)}
                        placeholder="Taille"
                        className="w-24 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded text-white text-sm"
                      />
                      <input
                        type="number"
                        value={size.stock_quantity}
                        onChange={(e) => updateSize(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                        placeholder="Stock"
                        className="w-24 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded text-white text-sm"
                      />
                      <div className="flex items-center">
                        <span className="text-slate-500 text-sm mr-2">Prix +/-</span>
                        <input
                          type="number"
                          value={size.price_adjustment}
                          onChange={(e) => updateSize(index, 'price_adjustment', parseFloat(e.target.value) || 0)}
                          className="w-24 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded text-white text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Couleurs</h2>
                <button
                  type="button"
                  onClick={addColor}
                  className="flex items-center px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Ajouter une Couleur
                </button>
              </div>

              {colors.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>Aucune couleur ajoutée. Cliquez sur &quot;Ajouter une Couleur&quot; pour commencer.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <input
                        type="color"
                        value={color.hex_code}
                        onChange={(e) => updateColor(index, 'hex_code', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color.name_en}
                        onChange={(e) => updateColor(index, 'name_en', e.target.value)}
                        placeholder="Nom (EN)"
                        className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded text-white text-sm"
                      />
                      <input
                        type="text"
                        value={color.name_fr}
                        onChange={(e) => updateColor(index, 'name_fr', e.target.value)}
                        placeholder="Nom (FR)"
                        className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded text-white text-sm"
                      />
                      <input
                        type="number"
                        value={color.stock_quantity}
                        onChange={(e) => updateColor(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                        placeholder="Stock"
                        className="w-20 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded text-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Organization Tab */}
        {activeTab === 'organization' && (
          <div className="space-y-6">
            {/* Status & Flags */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Statut & Visibilité</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                    <option value="out_of_season">Hors Saison</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ordre d&apos;Affichage</label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-700">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  <span className="ml-3 text-sm font-medium text-slate-300">Produit Vedette</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_new"
                    checked={formData.is_new}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  <span className="ml-3 text-sm font-medium text-slate-300">Nouveauté</span>
                </label>
              </div>
            </div>

            {/* Collections */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Collections</h2>
              
              <div className="flex flex-wrap gap-2">
                {allCollections.map((collection) => (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => toggleCollection(collection.id)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedCollections.includes(collection.id)
                        ? 'bg-amber-500 text-slate-900'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {collection.name_fr || collection.name_en}
                  </button>
                ))}
              </div>
              
              {allCollections.length === 0 && (
                <p className="text-slate-400 text-sm">
                  Aucune collection disponible. <Link href="/admin/collections/new" className="text-amber-500 hover:underline">Créer une collection</Link>
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Tags</h2>
              
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {tag.name_fr || tag.name_en}
                  </button>
                ))}
              </div>
              
              {allTags.length === 0 && (
                <p className="text-slate-400 text-sm">
                  Aucun tag disponible. <Link href="/admin/tags/new" className="text-amber-500 hover:underline">Créer un tag</Link>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 text-slate-300 hover:text-white transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-medium rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
          >
            <Save size={18} className="mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer le Produit'}
          </button>
        </div>
      </form>
    </div>
  )
}
