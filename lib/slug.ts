/**
 * Create a URL-safe slug from a product name.
 * Used for short product URLs: /product/93ee8be9-imperial-caftan-royale
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUUID(str: string): boolean {
  return UUID_REGEX.test(str)
}

/**
 * Build short product URL slug: first 8 chars of id + title slug
 * e.g. 93ee8be9-imperial-caftan-royale
 */
export function productSlug(id: string, name: string): string {
  const shortId = id.replace(/-/g, '').slice(0, 8)
  const slug = slugify(name)
  return slug ? `${shortId}-${slug}` : shortId
}
