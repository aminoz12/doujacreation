'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Save,
  RefreshCw,
  Truck,
  CreditCard,
  FileText
} from 'lucide-react'

interface OrderItem {
  id: string
  product_id: string
  product_name_en: string
  product_name_fr: string
  product_sku: string
  product_image_url: string
  quantity: number
  unit_price: number
  total_price: number
  size: string
  color: string
}

interface Order {
  id: string
  order_number: string
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  billing_address: string
  billing_city: string
  billing_postal_code: string
  billing_country: string
  subtotal: number
  shipping_cost: number
  discount_amount: number
  total_amount: number
  currency: string
  payment_method: string
  payment_status: string
  sumup_checkout_id: string
  sumup_transaction_id: string
  status: string
  customer_notes: string
  admin_notes: string
  created_at: string
  updated_at: string
  paid_at: string
  delivered_at: string
  order_items: OrderItem[]
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`)
      const data = await res.json()
      
      if (data.success) {
        setOrder(data.order)
        setStatus(data.order.status)
        setAdminNotes(data.order.admin_notes || '')
      } else {
        setError('Commande non trouvée')
      }
    } catch (err) {
      console.error('Failed to fetch order:', err)
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: adminNotes })
      })
      const data = await res.json()

      if (data.success) {
        setOrder(data.order)
        setSuccess('Commande mise à jour avec succès')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (err) {
      console.error('Save error:', err)
      setError('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'new': return <Sparkles size={18} />
      case 'pending': return <Clock size={18} />
      case 'delivered': return <CheckCircle size={18} />
      case 'cancelled': return <XCircle size={18} />
      default: return <Package size={18} />
    }
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">{error || 'Commande non trouvée'}</p>
        <Link href="/admin/orders/" className="text-amber-500 hover:underline mt-4 inline-block">
          ← Retour aux commandes
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/orders/"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              Commande {order.order_number}
              <span className={`ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1.5">
                  {order.status === 'new' ? 'Nouvelle' : 
                   order.status === 'pending' ? 'En attente' : 
                   order.status === 'delivered' ? 'Livrée' : 
                   order.status === 'cancelled' ? 'Annulée' : order.status}
                </span>
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Créée le {formatDate(order.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg flex items-center"
        >
          <CheckCircle size={18} className="mr-2" />
          {success}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Package size={20} className="mr-2 text-amber-500" />
              Articles commandés
            </h2>
            <div className="space-y-3">
              {order.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-3 bg-slate-700/30 rounded-lg"
                >
                  {item.product_image_url && (
                    <img
                      src={item.product_image_url}
                      alt={item.product_name_fr || item.product_name_en}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {item.product_name_fr || item.product_name_en}
                    </p>
                    <p className="text-sm text-slate-400">
                      {item.product_sku && <span>SKU: {item.product_sku} • </span>}
                      Qté: {item.quantity}
                      {item.size && ` • Taille: ${item.size}`}
                      {item.color && ` • Couleur: ${item.color}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-amber-500">
                      {item.total_price.toFixed(2)} €
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.unit_price.toFixed(2)} € × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Sous-total</span>
                <span className="text-white">{order.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Livraison</span>
                <span className="text-white">{order.shipping_cost.toFixed(2)} €</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Réduction</span>
                  <span className="text-green-400">-{order.discount_amount.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-slate-700">
                <span className="text-white">Total</span>
                <span className="text-amber-500">{order.total_amount.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <User size={20} className="mr-2 text-amber-500" />
              Informations client
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <User size={16} className="text-slate-500 mr-2 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500">Nom</p>
                    <p className="text-white">{order.customer_first_name} {order.customer_last_name}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail size={16} className="text-slate-500 mr-2 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <a href={`mailto:${order.customer_email}`} className="text-amber-500 hover:underline">
                      {order.customer_email}
                    </a>
                  </div>
                </div>
                {order.customer_phone && (
                  <div className="flex items-start">
                    <Phone size={16} className="text-slate-500 mr-2 mt-1" />
                    <div>
                      <p className="text-xs text-slate-500">Téléphone</p>
                      <a href={`tel:${order.customer_phone}`} className="text-white hover:text-amber-500">
                        {order.customer_phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin size={16} className="text-slate-500 mr-2 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500">Adresse de livraison</p>
                    <p className="text-white">{order.shipping_address}</p>
                    <p className="text-slate-400">
                      {order.shipping_postal_code && `${order.shipping_postal_code} `}
                      {order.shipping_city}, {order.shipping_country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {order.customer_notes && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-start">
                  <FileText size={16} className="text-slate-500 mr-2 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500">Note du client</p>
                    <p className="text-slate-300 text-sm">{order.customer_notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <CreditCard size={20} className="mr-2 text-amber-500" />
              Informations de paiement
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Méthode</p>
                <p className="text-white capitalize">{order.payment_method || 'SumUp'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Statut du paiement</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  order.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' :
                  order.payment_status === 'failed' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {order.payment_status === 'paid' ? 'Payé' :
                   order.payment_status === 'failed' ? 'Échoué' :
                   order.payment_status === 'refunded' ? 'Remboursé' : 'En attente'}
                </span>
              </div>
              {order.paid_at && (
                <div>
                  <p className="text-xs text-slate-500">Payé le</p>
                  <p className="text-white">{formatDate(order.paid_at)}</p>
                </div>
              )}
              {order.sumup_transaction_id && (
                <div>
                  <p className="text-xs text-slate-500">Transaction SumUp</p>
                  <p className="text-slate-400 text-sm font-mono">{order.sumup_transaction_id}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Truck size={20} className="mr-2 text-amber-500" />
              Mettre à jour le statut
            </h2>
            
            <div className="space-y-3">
              {['new', 'pending', 'delivered'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`w-full flex items-center p-3 rounded-lg border transition-colors ${
                    status === s
                      ? getStatusColor(s)
                      : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {getStatusIcon(s)}
                  <span className="ml-2 font-medium">
                    {s === 'new' ? 'Nouvelle commande' :
                     s === 'pending' ? 'En attente' :
                     s === 'delivered' ? 'Livrée' : s}
                  </span>
                </button>
              ))}
            </div>

            {order.delivered_at && (
              <p className="text-xs text-slate-500 mt-3">
                Livrée le {formatDate(order.delivered_at)}
              </p>
            )}
          </div>

          {/* Admin Notes */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText size={20} className="mr-2 text-amber-500" />
              Notes admin
            </h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Ajouter des notes internes..."
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-medium rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Enregistrer les modifications
              </>
            )}
          </button>

          {/* Timestamps */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Créée</span>
                <span className="text-slate-400">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Modifiée</span>
                <span className="text-slate-400">{formatDate(order.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


