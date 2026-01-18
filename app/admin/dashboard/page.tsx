'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Package,
  FolderOpen,
  Percent,
  TrendingUp,
  ShoppingBag,
  Plus,
  ArrowRight,
  ClipboardList,
  Clock,
  CheckCircle,
  Sparkles
} from 'lucide-react'

interface DashboardStats {
  totalProducts: number
  publishedProducts: number
  draftProducts: number
  totalCollections: number
  activeCollections: number
  lowStockProducts: number
  activePromotions: number
  featuredProducts: number
  newProducts: number
}

interface OrderStats {
  newOrders: number
  pendingOrders: number
  deliveredOrders: number
}

interface RecentOrder {
  id: string
  order_number: string
  customer_first_name: string
  customer_last_name: string
  total_amount: number
  currency: string
  status: string
  created_at: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [orderStats, setOrderStats] = useState<OrderStats>({ newOrders: 0, pendingOrders: 0, deliveredOrders: 0 })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard')
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        setOrderStats(data.orderStats || { newOrders: 0, pendingOrders: 0, deliveredOrders: 0 })
        setRecentOrders(data.recentOrders || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'delivered': return 'bg-green-500/20 text-green-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-slate-500/20 text-slate-400'
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

  const statCards = stats ? [
    {
      title: 'Total Produits',
      value: stats.totalProducts,
      subtitle: `${stats.publishedProducts} publiés, ${stats.draftProducts} brouillons`,
      icon: <Package className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/products/'
    },
    {
      title: 'Collections',
      value: stats.totalCollections,
      subtitle: `${stats.activeCollections} actives`,
      icon: <FolderOpen className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/collections/'
    },
    {
      title: 'Nouvelles Commandes',
      value: orderStats.newOrders,
      subtitle: 'À traiter',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      href: '/admin/orders/?filter=new'
    },
    {
      title: 'Promotions Actives',
      value: stats.activePromotions,
      subtitle: 'Produits en solde',
      icon: <Percent className="w-6 h-6" />,
      color: 'from-amber-500 to-amber-600',
      href: '/admin/products/?filter=promotions'
    },
  ] : []

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-slate-400 mt-1">Bienvenue ! Voici l&apos;aperçu de votre boutique.</p>
        </div>
        <Link
          href="/admin/products/new/"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-medium rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
        >
          <Plus size={20} className="mr-2" />
          Ajouter un produit
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={stat.href}>
              <div className="relative overflow-hidden bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-colors group">
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} mb-3`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-slate-300">{stat.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 rounded-xl border border-slate-700 p-5"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Actions rapides</h2>
          <div className="space-y-2">
            <Link
              href="/admin/products/new/"
              className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors group"
            >
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 text-amber-500 mr-3" />
                <span className="text-slate-300">Ajouter un nouveau produit</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
            </Link>
            <Link
              href="/admin/collections/new/"
              className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors group"
            >
              <div className="flex items-center">
                <FolderOpen className="w-5 h-5 text-purple-500 mr-3" />
                <span className="text-slate-300">Créer une collection</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-500 transition-colors" />
            </Link>
            <Link
              href="/admin/tags/new/"
              className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors group"
            >
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-slate-300">Ajouter une étiquette</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-green-500 transition-colors" />
            </Link>
          </div>
        </motion.div>

        {/* Order Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-xl border border-slate-700 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Aperçu des commandes</h2>
            <Link 
              href="/admin/orders/"
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
            >
              Voir tout →
            </Link>
          </div>
          
          {/* Order Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Link href="/admin/orders/?filter=new" className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-blue-400">{orderStats.newOrders}</p>
              <p className="text-xs text-slate-400">Nouvelle</p>
            </Link>
            <Link href="/admin/orders/?filter=pending" className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-yellow-400">{orderStats.pendingOrders}</p>
              <p className="text-xs text-slate-400">En attente</p>
            </Link>
            <Link href="/admin/orders/?filter=delivered" className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-colors text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-400">{orderStats.deliveredOrders}</p>
              <p className="text-xs text-slate-400">Livrée</p>
            </Link>
          </div>

          {/* Recent Orders */}
          {recentOrders.length === 0 ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-700/50 mb-3">
                <ClipboardList className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-slate-400">Aucune commande récente</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recentOrders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}/`}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {order.order_number}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {order.customer_first_name} {order.customer_last_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    <span className="text-sm font-medium text-amber-500">
                      {order.total_amount.toFixed(2)}€
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Featured & New Products Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800 rounded-xl border border-slate-700 p-5"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Aperçu des produits</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-slate-700/30">
              <p className="text-2xl font-bold text-amber-500">{stats.featuredProducts}</p>
              <p className="text-sm text-slate-400">En vedette</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-700/30">
              <p className="text-2xl font-bold text-green-500">{stats.newProducts}</p>
              <p className="text-sm text-slate-400">Nouveautés</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-700/30">
              <p className="text-2xl font-bold text-purple-500">{stats.activePromotions}</p>
              <p className="text-sm text-slate-400">En promotion</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-700/30">
              <p className="text-2xl font-bold text-blue-500">{stats.publishedProducts}</p>
              <p className="text-sm text-slate-400">Publiés</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
