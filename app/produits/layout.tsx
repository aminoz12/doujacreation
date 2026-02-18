// Force dynamic so /produits always fetches fresh product list (no static/cache)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ProduitsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
