# DoujaCreation - Luxury Moroccan E-Commerce

A cinematic, immersive, ultra-luxury e-commerce frontend for selling Moroccan caftans, jellabas, takchitas, and traditional luxury items.

## 🎨 Design Philosophy

This website embodies **quiet luxury** - power, heritage, and prestige. Every detail is crafted to feel like a digital luxury boutique in Paris or Dubai.

## 🛠️ Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** + CSS variables
- **Framer Motion** (Advanced animations)
- **Lenis** (Smooth scrolling)
- **Lucide React** (Icons)
- **next/image** (Optimized images)

## 🎨 Luxury Brand System

### Colors
- **Imperial Gold**: `#C7A14A`
- **Soft Champagne Gold**: `#E8D8A8`
- **Pure White**: `#FFFFFF`
- **Warm Ivory**: `#FAF8F4`
- **Deep Black**: `#0E0E0E`

### Typography
- **Headings**: Playfair Display / Cormorant Garamond
- **Body**: Inter / Poppins

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
doujacreation/
├── app/                    # Next.js App Router pages
│   ├── collections/        # Collections page
│   ├── product/[id]/       # Product detail page
│   ├── lookbook/          # Editorial lookbook
│   ├── maison/            # Heritage/About page
│   ├── contact/           # Contact page
│   ├── cart/              # Shopping cart (UI only)
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── Button.tsx
│   ├── SmoothScroll.tsx
│   ├── ScrollProgress.tsx
│   └── PageLoader.tsx
├── sections/              # Home page sections
│   ├── HeroSection.tsx
│   ├── BrandStatement.tsx
│   ├── CategoryGrid.tsx
│   ├── SignatureCollection.tsx
│   ├── CraftsmanshipSection.tsx
│   ├── LookbookSection.tsx
│   ├── TestimonialsSection.tsx
│   └── NewsletterSection.tsx
├── lib/                   # Utilities
│   └── motion-variants.ts # Framer Motion variants
├── data/                  # Mock data
│   ├── products.ts
│   └── lookbook.ts
└── styles/                # Global styles
    └── globals.css
```

## ✨ Features

### Home Page Sections
1. **Cinematic Hero** - Fullscreen with parallax and animated reveals
2. **Luxury Brand Statement** - Minimal, elegant typography
3. **Haute Collection Categories** - Animated grid with hover effects
4. **Signature Collection Slider** - Horizontal scroll with cinematic transitions
5. **Craftsmanship Section** - Split layout with scroll-linked motion
6. **Lookbook Editorial** - Magazine-style layout
7. **Testimonials** - Luxury tone, minimal design
8. **Newsletter** - Private club signup

### Pages
- **Collections** - Filterable product grid
- **Product Detail** - Cinematic gallery with smooth transitions
- **Lookbook** - Editorial photography showcase
- **Maison** - Heritage and brand story
- **Contact** - Elegant contact form
- **Cart** - Shopping cart UI (ready for backend integration)

### Animations
- Page transitions
- Scroll reveal animations
- Layout shift animations
- Hover micro-interactions
- Staggered sequences
- Smooth scrolling with Lenis
- Scroll progress bar
- Page loader with logo reveal

## 🎯 Design Principles

- **Slow, calm, confident animations**
- **Editorial spacing**
- **Large typography**
- **No visual noise**
- **Micro-interactions everywhere**
- **Luxury ≠ complexity**

## 📝 Notes

- This is a **frontend-only** implementation
- No backend or API calls
- Mock product data included
- Ready for NestJS backend integration later
- All images use Unsplash placeholders (replace with actual product images)

## 🔮 Future Enhancements

- Backend integration (NestJS)
- Real product data
- Shopping cart functionality
- Checkout process
- User authentication
- Admin dashboard
- Payment integration

---

**DoujaCreation** - Timeless elegance meets heritage craftsmanship.



