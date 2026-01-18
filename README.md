# Zinachic - Luxury Moroccan E-Commerce

A cinematic, immersive, ultra-luxury e-commerce frontend for selling Moroccan caftans, jellabas, takchitas, and traditional luxury items.

## 🎨 Design Philosophy

This website embodies **quiet luxury** - power, heritage, and prestige. Every detail is crafted to feel like a digital luxury boutique in Paris or Dubai.

## 🛠️ Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** + CSS variables
- **Framer Motion** (Advanced animations)
- **Supabase** (Database & Storage)
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

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Database Setup

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Run the `supabase-schema.sql` file to create all tables
4. Create a storage bucket named `product-images` with public access

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

## 🚀 Deploy on Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aminoz12/zinachic)

### Manual Deployment

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import the `zinachic` repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**

Your site will be live at `https://zinachic.vercel.app`

## 📁 Project Structure

```
zinachic/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel pages
│   │   ├── login/          # Admin login
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── products/       # Product management
│   │   ├── collections/    # Collection management
│   │   ├── tags/           # Tag management
│   │   ├── currency/       # Currency rates
│   │   └── settings/       # Admin settings
│   ├── api/                # API routes
│   │   ├── admin/          # Admin API endpoints
│   │   ├── products/       # Public product API
│   │   └── collections/    # Public collections API
│   ├── collections/        # Collections page
│   ├── product/[id]/       # Product detail page
│   ├── produits/           # Products listing page
│   ├── lookbook/           # Editorial lookbook
│   ├── maison/             # Heritage/About page
│   ├── contact/            # Contact page
│   ├── cart/               # Shopping cart
│   └── page.tsx            # Home page
├── components/             # Reusable components
├── sections/               # Home page sections
├── lib/                    # Utilities & Supabase client
├── data/                   # Static data
└── styles/                 # Global styles
```

## 🔐 Admin Panel

Access the admin panel at `/admin/login`

### Default Credentials
- **Username**: dija
- **Password**: dija123@

### Features
- 📦 Product management (CRUD, images, variants)
- 📁 Collection management
- 🏷️ Tag management
- 💰 Currency rate management (auto-sync with EUR)
- 🖼️ Image upload to Supabase Storage
- 🌐 Multilingual support (EN/FR)
- 📊 Dashboard with statistics

## ✨ Features

### Public Website
- **Cinematic Hero** - Fullscreen with parallax and animated reveals
- **Luxury Brand Statement** - Minimal, elegant typography
- **Haute Collection Categories** - Animated grid with hover effects
- **Signature Collection Slider** - Horizontal scroll with cinematic transitions
- **Craftsmanship Section** - Split layout with scroll-linked motion
- **Lookbook Editorial** - Magazine-style layout
- **Testimonials** - Luxury tone, minimal design
- **Newsletter** - Private club signup

### E-Commerce
- Dynamic product listing from database
- Product filtering by collection
- Product detail pages
- Shopping cart UI
- Multilingual content (EN/FR)

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

- Primary currency: EUR (€)
- Admin panel language: French
- Images stored in Supabase Storage
- All API routes are protected with session authentication

---

**Zinachic** - Timeless elegance meets heritage craftsmanship.
