'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Trash2, Upload, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Collection } from '@/lib/supabase'

interface CollectionFormData {
  slug: string
  name_en: string
  name_fr: string
  description_en: string
  description_fr: string
  image_url: string
  meta_title_en: string
  meta_title_fr: string
  meta_description_en: string
  meta_description_fr: string
  display_order: number
  is_active: boolean
}

const initialFormData: CollectionFormData = {
  slug: '',
  name_en: '',
  name_fr: '',
  description_en: '',
  description_fr: '',
  image_url: '',
  meta_title_en: '',
  meta_title_fr: '',
  meta_description_en: '',
  meta_description_fr: '',
  display_order: 0,
  is_active: true
}

export default function CollectionEditPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const isNew = id === 'new'
  
  const [formData, setFormData] = useState<CollectionFormData>(initialFormData)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isNew) {
      fetchCollection()
    }
  }, [id, isNew])

  const fetchCollection = async () => {
    try {
      const res = await fetch(`/api/admin/collections/${id}`)
      const data = await res.json()
      if (data.success && data.collection) {
        setFormData({
          slug: data.collection.slug || '',
          name_en: data.collection.name_en || '',
          name_fr: data.collection.name_fr || '',
          description_en: data.collection.description_en || '',
          description_fr: data.collection.description_fr || '',
          image_url: data.collection.image_url || '',
          meta_title_en: data.collection.meta_title_en || '',
          meta_title_fr: data.collection.meta_title_fr || '',
          meta_description_en: data.collection.meta_description_en || '',
          meta_description_fr: data.collection.meta_description_fr || '',
          display_order: data.collection.display_order || 0,
          is_active: data.collection.is_active ?? true
        })
      }
    } catch (error) {
      console.error('Échec du chargement de la collection:', error)
      setError('Impossible de charger la collection')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const generateSlug = () => {
    const slug = formData.name_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('folder', 'collections')

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload
      })
      const data = await res.json()
      if (data.success) {
        setFormData(prev => ({ ...prev, image_url: data.url }))
      } else {
        setError(data.error || 'Échec du téléchargement de l\'image')
      }
    } catch (error) {
      console.error('Erreur de téléchargement:', error)
      setError('Échec du téléchargement de l\'image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const url = isNew ? '/api/admin/collections' : `/api/admin/collections/${id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/collections')
      } else {
        setError(data.error || 'Échec de l\'enregistrement de la collection')
      }
    } catch (error) {
      console.error('Erreur d\'enregistrement:', error)
      setError('Échec de l\'enregistrement de la collection')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette collection ?')) return

    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        router.push('/admin/collections')
      } else {
        setError(data.error || 'Échec de la suppression de la collection')
      }
    } catch (error) {
      console.error('Erreur de suppression:', error)
      setError('Échec de la suppression de la collection')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            href="/admin/collections"
            className="mr-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNew ? 'Nouvelle Collection' : 'Modifier la Collection'}
            </h1>
            {!isNew && (
              <p className="text-slate-400 text-sm mt-1">ID: {id}</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
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
                onBlur={() => !formData.slug && generateSlug()}
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
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Slug *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Générer
              </button>
            </div>
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
                rows={3}
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
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Image de la Collection</h2>
          
          <div className="flex items-start gap-4">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
              {formData.image_url ? (
                <>
                  <Image
                    src={formData.image_url}
                    alt="Collection"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  Pas d&apos;image
                </div>
              )}
            </div>
            <div>
              <label className="flex items-center px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors">
                <Upload size={18} className="mr-2" />
                {uploading ? 'Téléchargement...' : 'Télécharger une Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-500 mt-2">
                Recommandé: 800x800px, JPG ou PNG
              </p>
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

        {/* Settings */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Paramètres</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ordre d&apos;Affichage
              </label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div className="flex items-center pt-7">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                <span className="ml-3 text-sm font-medium text-slate-300">Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/collections"
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
            {saving ? 'Enregistrement...' : 'Enregistrer la Collection'}
          </button>
        </div>
      </form>
    </div>
  )
}
