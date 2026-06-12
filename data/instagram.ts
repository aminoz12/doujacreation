// UGC / Instagram gallery feed.
//
// This is intentionally a simple data array so the team can curate it without
// a build, OR wire it later to the Instagram Basic Display API / a service like
// Behold or EmbedSocial (replace this array with a fetch in the section).
//
// Each post links somewhere "shoppable": a product page, a collection, or the
// Instagram post itself.

export interface InstagramPost {
  id: string
  image: string
  /** Where the tile links — a product/collection page (shoppable) or an IG URL. */
  href: string
  /** Optional caption shown on hover. */
  caption?: string
  /** Marks the tile as shoppable (shows the bag icon). */
  shoppable?: boolean
}

export const INSTAGRAM_HANDLE = 'zinachic'
export const INSTAGRAM_URL = 'https://instagram.com/zinachic'

export const instagramPosts: InstagramPost[] = [
  { id: '1', image: '/b1.png', href: '/produits', caption: 'Takchita Impériale', shoppable: true },
  { id: '2', image: '/b2.png', href: '/produits', caption: 'Caftan Soirée', shoppable: true },
  { id: '3', image: '/a1.png', href: '/produits', caption: 'Édition Mariage', shoppable: true },
  { id: '4', image: '/b3.png', href: '/produits', caption: 'Soie & Fil d’or', shoppable: true },
  { id: '5', image: '/a2.png', href: '/produits', caption: 'Jellaba Cérémonie', shoppable: true },
  { id: '6', image: '/b4.png', href: '/produits', caption: 'Collection Signature', shoppable: true },
  { id: '7', image: '/a3.png', href: '/produits', caption: 'Élégance Nocturne', shoppable: true },
  { id: '8', image: '/a4.png', href: '/produits', caption: 'Henné & Tradition', shoppable: true },
]
