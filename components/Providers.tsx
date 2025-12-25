'use client'

import { LanguageProvider } from '@/contexts/LanguageContext'
import PageLoader from '@/components/PageLoader'
import ScrollProgress from '@/components/ScrollProgress'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function Providers({ children }: { children: React.ReactNode }) {
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



