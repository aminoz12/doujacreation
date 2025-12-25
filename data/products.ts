export interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  featured?: boolean
  new?: boolean
}

export const categories = [
  { id: 'caftan', name: 'Caftan', slug: 'caftan' },
  { id: 'jellaba', name: 'Jellaba', slug: 'jellaba' },
  { id: 'takchita', name: 'Takchita', slug: 'takchita' },
  { id: 'homme', name: 'Homme', slug: 'homme' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories' },
  { id: 'home', name: 'Moroccan Home', slug: 'home' },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Imperial Caftan Royale',
    category: 'caftan',
    price: 2890,
    originalPrice: 3490,
    description: 'Hand-embroidered with gold thread, featuring traditional Moroccan motifs. Crafted from the finest silk and adorned with Swarovski crystals.',
    images: [
      '/cat1.png',
      '/cat2.png',
      '/cat3.png',
    ],
    featured: true,
    new: true,
  },
  {
    id: '2',
    name: 'Heritage Jellaba',
    category: 'jellaba',
    price: 1250,
    description: 'Classic Moroccan jellaba in premium wool, featuring intricate hand-stitched patterns and traditional hood design.',
    images: [
      '/cat2.png',
      '/cat3.png',
    ],
    featured: true,
  },
  {
    id: '3',
    name: 'Takchita Elégance',
    category: 'takchita',
    price: 3200,
    description: 'Two-piece ceremonial takchita with elaborate embroidery. The perfect ensemble for special occasions and celebrations.',
    images: [
      '/cat3.png',
      '/cat4.png',
    ],
    featured: true,
    new: true,
  },
  {
    id: '4',
    name: 'Caftan Soirée',
    category: 'caftan',
    price: 1890,
    description: 'Evening caftan in deep emerald with gold accents. Elegant and sophisticated for formal gatherings.',
    images: [
      '/cat4.png',
      '/cat5.png',
    ],
  },
  {
    id: '5',
    name: 'Jellaba Moderne',
    category: 'jellaba',
    price: 950,
    description: 'Contemporary jellaba with modern cuts while preserving traditional elegance. Perfect for everyday luxury.',
    images: [
      '/cat1.png',
      '/cat1.png',
    ],
  },
  {
    id: '6',
    name: 'Takchita Royale',
    category: 'takchita',
    price: 4500,
    originalPrice: 5200,
    description: 'Ultra-luxury takchita with hand-sewn pearls and gold thread embroidery. A masterpiece of Moroccan craftsmanship.',
    images: [
      '/cat1.png',
      '/cat1.png',
    ],
    featured: true,
  },
  {
    id: '7',
    name: 'Caftan Printemps',
    category: 'caftan',
    price: 1650,
    description: 'Spring collection caftan in soft pastels with delicate floral embroidery. Lightweight and breathable.',
    images: [
      '/cat1.png',
      '/cat1.png',
    ],
  },
  {
    id: '8',
    name: 'Jellaba Classique',
    category: 'jellaba',
    price: 1100,
    description: 'Timeless classic jellaba in navy blue with subtle gold trim. Versatile and elegant.',
    images: [
      '/cat1.png',
      '/cat1.png',
    ],
  },
  {
    id: '9',
    name: 'Takchita Cérémonie',
    category: 'takchita',
    price: 2800,
    description: 'Ceremonial takchita designed for weddings and special celebrations. Rich fabrics and intricate details.',
    images: [
      '/cat5.png',
      '/cat1.png',
    ],
  },
  {
    id: '10',
    name: 'Caftan Haute Couture',
    category: 'caftan',
    price: 5500,
    description: 'One-of-a-kind haute couture caftan. Custom-made with the finest materials and exceptional craftsmanship.',
    images: [
      '/cat1.png',
      '/cat1.png',
    ],
    featured: true,
  },
  {
    id: '11',
    name: 'Jellaba Premium',
    category: 'jellaba',
    price: 1350,
    description: 'Premium jellaba with cashmere blend. Ultimate comfort meets traditional style.',
    images: [
      '/cat1.png',
      '/cat1.png',
    ],
  },
  {
    id: '12',
    name: 'Takchita Élégance Moderne',
    category: 'takchita',
    price: 2400,
    description: 'Modern interpretation of the traditional takchita. Contemporary elegance with heritage roots.',
    images: [
      '/cat1.png',
      '/cat1.png',
    ],
  },
  {
    id: '13',
    name: 'JABADOUR ROUGE & DOREE',
    category: 'homme',
    price: 880,
    description: 'Traditional Moroccan jabadour in red and gold, featuring intricate embroidery and elegant design.',
    images: [
      '/a1.png',
      '/a2.png',
      '/a3.png',
      '/a4.png',
    ],
    new: true,
  },
  {
    id: '14',
    name: 'High Neck Tee Dark Cherry',
    category: 'femme',
    price: 880,
    description: 'Elegant high neck tee in dark cherry color, perfect for modern modest fashion.',
    images: [
      '/a1.png',
    ],
    new: true,
  },
  {
    id: '15',
    name: 'Casual Pants Dark Cherry',
    category: 'femme',
    price: 772,
    description: 'Comfortable casual pants in dark cherry, designed for everyday elegance.',
    images: [
      '/a2.png',
    ],
    new: true,
  },
  {
    id: '16',
    name: 'High Neck Tee Black',
    category: 'femme',
    price: 680,
    description: 'Classic high neck tee in black, versatile and timeless.',
    images: [
      '/a3.png',
    ],
    new: true,
  },
  {
    id: '17',
    name: 'Casual Pants Black',
    category: 'femme',
    price: 772,
    description: 'Elegant black casual pants, perfect for any occasion.',
    images: [
      '/a4.png',
    ],
    new: true,
  },
  {
    id: '18',
    name: 'High Neck Tee Burgundy',
    category: 'femme',
    price: 880,
    description: 'Sophisticated high neck tee in burgundy, rich and elegant.',
    images: [
      '/a1.png',
    ],
    new: true,
  },
  {
    id: '19',
    name: 'Casual Pants Navy',
    category: 'femme',
    price: 772,
    description: 'Classic navy casual pants, versatile and stylish.',
    images: [
      '/a2.png',
    ],
    new: true,
  },
  {
    id: '20',
    name: 'High Neck Tee White',
    category: 'femme',
    price: 880,
    description: 'Clean and elegant white high neck tee, essential for any wardrobe.',
    images: [
      '/a3.png',
    ],
    new: true,
  },
  {
    id: '21',
    name: 'Moroccan Heritage Collection',
    category: 'caftan',
    price: 2200,
    description: 'Exquisite caftan featuring traditional Moroccan patterns with modern elegance. Crafted from premium fabric with intricate detailing.',
    images: [
      '/b1.png',
      '/b2.png',
      '/b3.png',
      '/b4.png',
    ],
    featured: true,
    new: true,
  },
]

export const featuredProducts = products.filter(p => p.featured)
export const newProducts = products.filter(p => p.new)

