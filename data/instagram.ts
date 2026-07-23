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
  /** Cover image; also used as the video poster when `video` is set. */
  image: string
  /** Optional reel clip (mp4/webm, e.g. '/reels/reel-1.mp4'). Autoplays muted in a 9:16 card. */
  video?: string
  /** Where the tile links — a product/collection page (shoppable) or an IG URL. */
  href: string
  /** Optional caption shown on hover. */
  caption?: string
  /** Marks the tile as shoppable (shows the bag icon). */
  shoppable?: boolean
}

export const INSTAGRAM_HANDLE = 'zinachic'
export const INSTAGRAM_URL = 'https://instagram.com/zinachic'

// Reel clips live in /public (vid1..vid5). The `image` doubles as poster/fallback
// while a clip loads.
export const instagramPosts: InstagramPost[] = [
  { id: '1', image: '/b1.png', video: '/vid1.mp4', href: '/produits', caption: 'Takchita Impériale', shoppable: true },
  { id: '2', image: '/b2.png', video: '/vid2.mp4', href: '/produits', caption: 'Caftan Soirée', shoppable: true },
  { id: '3', image: '/a1.png', video: '/vid3.mp4', href: '/produits', caption: 'Édition Mariage', shoppable: true },
  { id: '4', image: '/b3.png', video: '/vid4.mp4', href: '/produits', caption: 'Soie & Fil d’or', shoppable: true },
  { id: '5', image: '/a2.png', video: '/vid5.mp4', href: '/produits', caption: 'Jellaba Cérémonie', shoppable: true },
]
