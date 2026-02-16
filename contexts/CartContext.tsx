'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'

export interface CartItem {
  product_id: string
  product_name_en: string
  product_name_fr: string
  product_sku?: string
  product_image_url?: string
  quantity: number
  unit_price: number
  size?: string
  color?: string
}

const CART_STORAGE_KEY = 'zinachic_cart'

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string, size?: string, color?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

function itemKey(item: CartItem) {
  return `${item.product_id}|${item.size ?? ''}|${item.color ?? ''}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(loadCart())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) saveCart(items)
  }, [items, hydrated])

  const addItem = useCallback(
    (input: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      const qty = Math.max(1, input.quantity ?? 1)
      const newItem: CartItem = {
        product_id: input.product_id,
        product_name_en: input.product_name_en,
        product_name_fr: input.product_name_fr,
        product_sku: input.product_sku,
        product_image_url: input.product_image_url,
        unit_price: input.unit_price,
        size: input.size,
        color: input.color,
        quantity: qty
      }
      setItems((prev) => {
        const key = itemKey(newItem)
        const idx = prev.findIndex((i) => itemKey(i) === key)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = { ...next[idx], quantity: next[idx].quantity + qty }
          return next
        }
        return [...prev, newItem]
      })
    },
    []
  )

  const removeItem = useCallback((productId: string, size?: string, color?: string) => {
    const key = `${productId}|${size ?? ''}|${color ?? ''}`
    setItems((prev) => prev.filter((i) => itemKey(i) !== key))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string, color?: string) => {
      const key = `${productId}|${size ?? ''}|${color ?? ''}`
      setItems((prev) => {
        const idx = prev.findIndex((i) => itemKey(i) === key)
        if (idx < 0) return prev
        if (quantity < 1) return prev.filter((_, i) => i !== idx)
        const next = [...prev]
        next[idx] = { ...next[idx], quantity }
        return next
      })
    },
    []
  )

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0)

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (ctx === undefined) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
