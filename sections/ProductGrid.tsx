'use client'

import Image from 'next/image'
import Link from 'next/link'
import { products } from '@/data/products'

export default function ProductGrid() {
  // Get the 8 newest products (ids 14-21)
  const displayProducts = products.filter(p => ['14', '15', '16', '17', '18', '19', '20', '21'].includes(p.id))

  return (
    <section className="section-padding bg-luxury-ivory">
      <div className="container-luxury">
        {/* Heading */}
        <div className="flex items-center justify-center mb-10">
          <div className="hidden md:block h-px w-16 bg-gold-imperial mr-4" />
          <h2 className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-luxury-black">
            Decouvrer Nos Produits
          </h2>
          <div className="hidden md:block h-px w-16 bg-gold-imperial ml-4" />
        </div>

        {/* Product Grid - 2 rows of 4 products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-luxury-white">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Product Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-luxury-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-sans text-sm tracking-[0.2em] uppercase mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs opacity-90">{product.price} Dh</p>
                  </div>
                </div>
                
                {/* Product Info Below Image */}
                <div className="mt-3 text-center">
                  <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-luxury-black mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-luxury-black/70">{product.price} Dh</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Voir Tout Button */}
        <div className="flex justify-center mt-12">
          <Link 
            href="/produits"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold-imperial text-luxury-white font-sans text-sm tracking-wide uppercase hover:bg-gold-champagne transition-colors duration-300"
          >
            Voir Tout
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4-4m4 4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
