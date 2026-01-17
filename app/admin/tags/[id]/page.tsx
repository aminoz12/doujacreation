'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface TagFormData {
  slug: string
  name_en: string
  name_fr: string
}

const initialFormData: TagFormData = {
  slug: '',
  name_en: '',
  name_fr: ''
}

export default function TagEditPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const isNew = id === 'new'
  
  const [formData, setFormData] = useState<TagFormData>(initialFormData)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isNew) {
      fetchTag()
    }
  }, [id, isNew])

  const fetchTag = async () => {
    try {
      const res = await fetch(`/api/admin/tags/${id}`)
      const data = await res.json()
      if (data.success && data.tag) {
        setFormData({
          slug: data.tag.slug || '',
          name_en: data.tag.name_en || '',
          name_fr: data.tag.name_fr || ''
        })
      }
    } catch (error) {
      console.error('Échec du chargement du tag:', error)
      setError('Impossible de charger le tag')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateSlug = () => {
    const slug = formData.name_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const url = isNew ? '/api/admin/tags' : `/api/admin/tags/${id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/tags')
      } else {
        setError(data.error || 'Échec de l\'enregistrement du tag')
      }
    } catch (error) {
      console.error('Erreur d\'enregistrement:', error)
      setError('Échec de l\'enregistrement du tag')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) return

    try {
      const res = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        router.push('/admin/tags')
      } else {
        setError(data.error || 'Échec de la suppression du tag')
      }
    } catch (error) {
      console.error('Erreur de suppression:', error)
      setError('Échec de la suppression du tag')
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
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            href="/admin/tags"
            className="mr-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isNew ? 'Nouveau Tag' : 'Modifier le Tag'}
            </h1>
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

      <form onSubmit={handleSubmit}>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
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

          <div>
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
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 mt-6">
          <Link
            href="/admin/tags"
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
            {saving ? 'Enregistrement...' : 'Enregistrer le Tag'}
          </button>
        </div>
      </form>
    </div>
  )
}
