'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  MoreHorizontal
} from 'lucide-react'
import type { Collection } from '@/lib/supabase'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/admin/collections')
      const data = await res.json()
      if (data.success) {
        setCollections(data.collections)
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        setCollections(prev => prev.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete collection:', error)
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive })
      })
      const data = await res.json()
      if (data.success) {
        setCollections(prev => prev.map(c => 
          c.id === id ? { ...c, is_active: !isActive } : c
        ))
      }
    } catch (error) {
      console.error('Failed to toggle collection status:', error)
    }
  }

  const filteredCollections = collections.filter(c =>
    c.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl font-bold text-white">Collections</h1>
          <p className="text-slate-400 mt-1">Manage your product collections</p>
        </div>
        <Link
          href="/admin/collections/new"
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-medium rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
        >
          <Plus size={20} className="mr-2" />
          Add Collection
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* Collections List */}
      {filteredCollections.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700 mb-4">
            <Plus size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No collections found</h3>
          <p className="text-slate-400 mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first collection to get started'}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/collections/new"
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Collection
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Collection</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Slug</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredCollections.map((collection, index) => (
                <motion.tr
                  key={collection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-700 mr-3 flex-shrink-0">
                        {collection.image_url ? (
                          <Image
                            src={collection.image_url}
                            alt={collection.name_en}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{collection.name_en}</p>
                        <p className="text-sm text-slate-400">{collection.name_fr}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <code className="text-sm text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                      {collection.slug}
                    </code>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => toggleActive(collection.id, collection.is_active)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        collection.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-600/20 text-slate-400'
                      }`}
                    >
                      {collection.is_active ? (
                        <>
                          <Eye size={12} className="mr-1" /> Active
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} className="mr-1" /> Hidden
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-slate-400">{collection.display_order}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/collections/${collection.id}`}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

