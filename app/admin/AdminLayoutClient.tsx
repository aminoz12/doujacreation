'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  FolderOpen,
  Tags,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  DollarSign,
  ClipboardList,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  children?: { name: string; href: string }[]
}

const navigation: NavItem[] = [
  { name: 'Tableau de bord', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Commandes', href: '/admin/orders', icon: <ClipboardList size={20} /> },
  { name: 'Produits', href: '/admin/products', icon: <ShoppingBag size={20} /> },
  { name: 'Collections', href: '/admin/collections', icon: <FolderOpen size={20} /> },
  { name: 'Étiquettes', href: '/admin/tags', icon: <Tags size={20} /> },
  { name: 'Devises', href: '/admin/currency', icon: <DollarSign size={20} /> },
  { name: 'Paramètres', href: '/admin/settings', icon: <Settings size={20} /> },
]

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/'

  useEffect(() => {
    // Only fetch session info if not on login page
    if (!isLoginPage) {
      fetch('/api/admin/session')
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            setUsername(data.username)
          }
        })
        .catch(err => console.error('Session fetch error:', err))
    }
  }, [isLoginPage])

  // Skip layout for login page
  if (isLoginPage) {
    return <>{children}</>
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login/')
    router.refresh()
  }

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string) => pathname === href || pathname === href + '/' || pathname.startsWith(href + '/')

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <Link href="/admin/dashboard/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-900">D</span>
            </div>
            <span className="text-lg font-semibold text-white">Zinachic Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${
                        expandedItems.includes(item.name) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedItems.includes(item.name) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-10 py-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                pathname === child.href
                                  ? 'text-amber-500'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-slate-700">
          <div className="flex items-center px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-900">
                {username.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{username || 'Admin'}</p>
              <p className="text-xs text-slate-400">Administrateur</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="ml-3">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white mr-4"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center ml-auto space-x-4">
            {/* Space for future notifications or quick actions */}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
