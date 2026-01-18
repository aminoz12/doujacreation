'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search,
  Eye,
  Trash2,
  Filter,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'

interface Order {
  id: string
  order_number: string
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  customer_phone: string
  shipping_city: string
  shipping_country: string
  total_amount: number
  currency: string
  status: string
  payment_status: string
  created_at: string
  order_items: OrderItem[]
}

interface OrderItem {
  id: string
  product_name_fr: string
  product_name_en: string
  quantity: number
  unit_price: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const initialFilter = searchParams.get('filter') || 'all'
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(initialFilter)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })
      if (filter !== 'all') params.set('filter', filter)
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      
      if (data.success) {
        setOrders(data.orders || [])
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }, [filter, search, pagination.page, pagination.limit])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return
    
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (data.success) {
        setOrders(orders.filter(o => o.id !== id))
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Erreur lors de la suppression')
    } finally {
      setDeleting(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Sparkles size={14} />
      case 'pending': return <Clock size={14} />
      case 'delivered': return <CheckCircle size={14} />
      case 'cancelled': return <XCircle size={14} />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Nouvelle'
      case 'pending': return 'En attente'
      case 'delivered': return 'Livrée'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filters = [
    { value: 'all', label: 'Toutes', count: pagination.total },
    { value: 'new', label: 'Nouvelles', icon: <Sparkles size={14} /> },
    { value: 'pending', label: 'En attente', icon: <Clock size={14} /> },
    { value: 'delivered', label: 'Livrées', icon: <CheckCircle size={14} /> },
    { value: 'cancelled', label: 'Annulées', icon: <XCircle size={14} /> },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Commandes</h1>
          <p className="text-slate-400 mt-1">
            Gérez vos commandes et suivez les livraisons
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter size={18} className="text-slate-400" />
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-transparent'
            }`}
          >
            {f.icon && <span className="mr-1.5">{f.icon}</span>}
            {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par numéro, email ou nom du client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
              <Sparkles className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400">Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <Link href={`/admin/orders/${order.id}/`} className="hover:text-amber-500 transition-colors">
                        <span className="font-mono text-sm text-white">{order.order_number}</span>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {order.order_items?.length || 0} article(s)
                        </p>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-white">
                        {order.customer_first_name} {order.customer_last_name}
                      </p>
                      <p className="text-xs text-slate-400">{order.customer_email}</p>
                      <p className="text-xs text-slate-500">{order.shipping_city}, {order.shipping_country}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-amber-500">
                        {order.total_amount.toFixed(2)} €
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1.5">{getStatusLabel(order.status)}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-400">
                        {formatDate(order.created_at)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/orders/${order.id}/`}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={deleting === order.id}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          {deleting === order.id ? (
                            <RefreshCw size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              Page {pagination.page} sur {pagination.totalPages} ({pagination.total} commandes)
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

