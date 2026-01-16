'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw } from 'lucide-react'
import type { CurrencyRate } from '@/lib/supabase'

export default function CurrencyPage() {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
      setError('Failed to load currency rates')
    } finally {
      setLoading(false)
    }
  }

  const handleRateChange = (id: string, rate: number) => {
    setCurrencies(prev => prev.map(c => 
      c.id === id ? { ...c, rate_from_mad: rate } : c
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
        setSuccess('Currency rates updated successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to update rates')
      }
    } catch (error) {
      console.error('Save error:', error)
      setError('Failed to update currency rates')
    } finally {
      setSaving(false)
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
        <h1 className="text-2xl font-bold text-white">Currency Rates</h1>
        <p className="text-slate-400 mt-1">
          Manage conversion rates from Moroccan Dirham (MAD) to other currencies
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
          className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg"
        >
          {success}
        </motion.div>
      )}

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
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
                    1 MAD = {currency.rate_from_mad} {currency.currency_code}
                  </p>
                </div>
              </div>
              {currency.currency_code !== 'MAD' && (
                <div className="flex items-center">
                  <span className="text-slate-400 mr-2">Rate:</span>
                  <input
                    type="number"
                    value={currency.rate_from_mad}
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
              Last updated: {currencies[0]?.updated_at ? new Date(currencies[0].updated_at).toLocaleString() : 'N/A'}
            </p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-medium rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example Conversion */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Conversion Example</h2>
        <p className="text-slate-400 mb-4">
          If a product costs <span className="text-amber-500 font-medium">1000 MAD</span>, it will display as:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currencies.map((currency) => (
            <div key={currency.id} className="p-3 bg-slate-700/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-white">
                {currency.symbol}{(1000 * currency.rate_from_mad).toFixed(2)}
              </p>
              <p className="text-sm text-slate-400">{currency.currency_code}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

