'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Key, Shield } from 'lucide-react'

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setSaving(true)

    try {
      const res = await fetch('/api/admin/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      const data = await res.json()
      
      if (data.success) {
        setSuccess('Password updated successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to update password')
      }
    } catch (error) {
      console.error('Password change error:', error)
      setError('Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your admin account settings</p>
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

      {/* Change Password */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mr-4">
            <Key size={20} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Change Password</h2>
            <p className="text-sm text-slate-400">Update your admin password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-medium rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
          >
            <Save size={18} className="mr-2" />
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Security Info */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mr-4">
            <Shield size={20} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Security Tips</h2>
            <p className="text-sm text-slate-400">Keep your account secure</p>
          </div>
        </div>

        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            Use a strong, unique password with at least 8 characters
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            Include numbers, symbols, and mixed case letters
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            Don&apos;t share your credentials with anyone
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            Log out when using shared computers
          </li>
        </ul>
      </div>
    </div>
  )
}

