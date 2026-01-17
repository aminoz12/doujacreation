'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import type { Tag } from '@/lib/supabase'

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/admin/tags')
      const data = await res.json()
      if (data.success) {
        setTags(data.tags)
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette étiquette ?')) return

    try {
      const res = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        setTags(prev => prev.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete tag:', error)
    }
  }

  const filteredTags = tags.filter(t =>
    t.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Étiquettes</h1>
          <p className="text-slate-400 mt-1">Gérez les étiquettes de produits pour le filtrage</p>
        </div>
        <Link
          href="/admin/tags/new/"
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-medium rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
        >
          <Plus size={20} className="mr-2" />
          Ajouter une étiquette
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher des étiquettes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* Tags List */}
      {filteredTags.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700 mb-4">
            <Plus size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Aucune étiquette trouvée</h3>
          <p className="text-slate-400 mb-4">
            {searchQuery ? 'Essayez un autre terme de recherche' : 'Créez votre première étiquette pour commencer'}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/tags/new/"
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Ajouter une étiquette
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTags.map((tag, index) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white">{tag.name_fr}</h3>
                  <p className="text-sm text-slate-400">{tag.name_en}</p>
                  <code className="text-xs text-slate-500 mt-2 inline-block bg-slate-700/50 px-2 py-0.5 rounded">
                    {tag.slug}
                  </code>
                </div>
                <div className="flex items-center space-x-1">
                  <Link
                    href={`/admin/tags/${tag.id}/`}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
