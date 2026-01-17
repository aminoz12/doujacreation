'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, Globe, CheckCircle } from 'lucide-react'
import type { CurrencyRate } from '@/lib/supabase'

export default function CurrencyPage() {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null)

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const fetchCurrencies = async () => {
    try {
      const res = await fetch('/api/admin/currency')
      const data = await res.json()
      if (data.success) {
        setCurrencies(data.currencies)
      }
    } catch (error) {
      console.error('Failed to fetch currencies:', error)
      setError('Échec du chargement des taux de change')
    } finally {
      setLoading(false)
    }
  }

  const handleRateChange = (id: string, rate: number) => {
    setCurrencies(prev => prev.map(c => 
      c.id === id ? { ...c, rate_from_eur: rate } : c
    ))
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const res = await fetch('/api/admin/currency', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currencies })
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Taux de change mis à jour avec succès')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Échec de la mise à jour')
      }
    } catch (error) {
      console.error('Save error:', error)
      setError('Échec de la mise à jour des taux')
    } finally {
      setSaving(false)
    }
  }

  const handleSyncRates = async () => {
    setError('')
    setSuccess('')
    setSyncing(true)

    try {
      const res = await fetch('/api/admin/currency/sync', {
        method: 'POST'
      })
      const data = await res.json()
      
      if (data.success) {
        setCurrencies(data.currencies)
        setLastSyncDate(data.date)
        setSuccess(`Taux synchronisés avec succès depuis ${data.source}`)
        setTimeout(() => setSuccess(''), 5000)
      } else {
        setError(data.error || 'Échec de la synchronisation')
      }
    } catch (error) {
      console.error('Sync error:', error)
      setError('Échec de la synchronisation. Veuillez réessayer plus tard.')
    } finally {
      setSyncing(false)
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Taux de change</h1>
        <p className="text-slate-400 mt-1">
          Gérez les taux de conversion depuis l&apos;Euro (EUR) vers d&apos;autres devises
        </p>
      </div>

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

      {/* Auto Sync Card */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mr-4">
              <Globe size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Synchronisation automatique</h2>
              <p className="text-sm text-slate-400 mt-1">
                Récupérer les derniers taux de change officiels automatiquement
              </p>
              {lastSyncDate && (
                <p className="text-xs text-slate-500 mt-2">
                  Dernière sync : {lastSyncDate}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleSyncRates}
            disabled={syncing}
            className="flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-400 transition-all disabled:opacity-50"
          >
            {syncing ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Sync...
              </>
            ) : (
              <>
                <RefreshCw size={18} className="mr-2" />
                Synchroniser
              </>
            )}
          </button>
        </div>
      </div>

      {/* Manual Rates */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Taux actuels</h3>
        <div className="space-y-4">
          {currencies.map((currency) => (
            <div
              key={currency.id}
              className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{currency.symbol}</span>
                <div>
                  <p className="font-medium text-white">{currency.currency_code}</p>
                  <p className="text-sm text-slate-400">
                    1 EUR = {currency.rate_from_eur.toFixed(6)} {currency.currency_code}
                  </p>
                </div>
              </div>
              {currency.currency_code !== 'EUR' && (
                <div className="flex items-center">
                  <span className="text-slate-400 mr-2">Taux :</span>
                  <input
                    type="number"
                    value={currency.rate_from_eur}
                    onChange={(e) => handleRateChange(currency.id, parseFloat(e.target.value) || 0)}
                    step="0.000001"
                    min="0"
                    className="w-32 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-right focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Dernière mise à jour : {currencies[0]?.updated_at ? new Date(currencies[0].updated_at).toLocaleString('fr-FR') : 'N/A'}
            </p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-medium rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example Conversion */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Exemple de conversion</h2>
        <p className="text-slate-400 mb-4">
          Si un produit coûte <span className="text-amber-500 font-medium">100 €</span>, il s&apos;affichera comme :
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currencies.map((currency) => (
            <div key={currency.id} className="p-3 bg-slate-700/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-white">
                {currency.symbol}{(100 * currency.rate_from_eur).toFixed(2)}
              </p>
              <p className="text-sm text-slate-400">{currency.currency_code}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
        <p className="text-xs text-slate-500">
          💡 <strong>Astuce :</strong> Cliquez sur &quot;Synchroniser&quot; pour récupérer les derniers taux de change officiels. 
          Vous pouvez également ajuster les taux manuellement si nécessaire.
        </p>
      </div>
    </div>
  )
}
