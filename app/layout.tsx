import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Inter, Poppins, Caveat } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DoujaCreation | Luxury Moroccan Caftans & Traditional Wear',
  description: 'Discover the finest Moroccan caftans, jellabas, and takchitas. Timeless elegance meets heritage craftsmanship.',
  keywords: 'Moroccan caftan, jellaba, takchita, luxury fashion, traditional wear',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${poppins.variable} ${caveat.variable} font-sans antialiased bg-luxury-ivory text-luxury-black`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

