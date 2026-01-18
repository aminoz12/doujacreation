import { Suspense } from 'react'
import AdminLayoutClient from './AdminLayoutClient'

export const metadata = {
  title: 'Admin Panel - Douja Creation',
  description: 'Manage your Douja Creation store',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    }>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </Suspense>
  )
}





