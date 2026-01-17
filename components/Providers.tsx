'use client'

import { usePathname } from 'next/navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'
import PageLoader from '@/components/PageLoader'
import ScrollProgress from '@/components/ScrollProgress'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  // For admin routes, don't show the main site navigation/footer
  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <LanguageProvider>
      <PageLoader />
      <ScrollProgress />
      <Navigation />
      <main className="relative">
        {children}
      </main>
      <Footer />
    </LanguageProvider>
  )
}
