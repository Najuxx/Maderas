import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useProducts } from './ProductsContext'

const CART_STORAGE_KEY = 'maderas_cart'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { products } = useProducts()

  // Guardar solo { id, qty } en localStorage
  const [rawCart, setRawCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed.map((item) => ({
            id: Number(item.id),
            qty: Math.max(1, Number(item.qty) || 1),
          }))
        }
      }
    } catch (err) {
      console.warn('Error al leer el carrito de localStorage:', err)
    }
    return []
  })

  // Estado para deshacer eliminación (undo)
  const [lastRemoved, setLastRemoved] = useState(null)
  const [undoTimeoutId, setUndoTimeoutId] = useState(null)

  // Estado para toast/notificación de "Agregado al carrito"
  const [toastMessage, setToastMessage] = useState(null)
  const [toastTimeoutId, setToastTimeoutId] = useState(null)

  // Guardar en localStorage dentro de try/catch cada vez que cambie rawCart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(rawCart))
    } catch (err) {
      console.warn('Error al guardar el carrito en localStorage:', err)
    }
  }, [rawCart])

  // Re-leer precios y datos reales de Supabase desde `products`
  // Nunca confiamos en precios guardados localmente
  const cartItems = useMemo(() => {
    return rawCart
      .map((entry) => {
        const product = products.find((p) => Number(p.id) === Number(entry.id))
        if (!product) return null

        // Aseguramos que la cantidad no exceda el stock real ni 99
        const maxAvailable = product.stock > 0 ? Math.min(product.stock, 99) : 0
        const validQty = Math.max(1, Math.min(entry.qty, maxAvailable || 1))

        return {
          id: product.id,
          product,
          qty: validQty,
          subtotal: Number(product.price) * validQty,
        }
      })
      .filter(Boolean)
  }, [rawCart, products])

  // Contador total de productos en el carrito
  const totalCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0)
  }, [cartItems])

  // Subtotal del carrito
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.subtotal, 0)
  }, [cartItems])

  // Total (para invitados es igual al subtotal; los descuentos se calculan con cuenta)
  const total = subtotal

  const showToast = useCallback((productName) => {
    if (toastTimeoutId) clearTimeout(toastTimeoutId)
    setToastMessage({
      name: productName,
      text: 'Agregado al carrito',
    })
    const id = setTimeout(() => {
      setToastMessage(null)
    }, 4000)
    setToastTimeoutId(id)
  }, [toastTimeoutId])

  const dismissToast = useCallback(() => {
    if (toastTimeoutId) clearTimeout(toastTimeoutId)
    setToastMessage(null)
  }, [toastTimeoutId])

  // Agregar al carrito
  const addToCart = useCallback((productId, qtyToAdd = 1) => {
    const numId = Number(productId)
    const product = products.find((p) => Number(p.id) === numId)
    if (!product || product.stock <= 0) return false

    const maxStock = Math.min(product.stock, 99)

    setRawCart((prev) => {
      const existing = prev.find((item) => Number(item.id) === numId)
      if (existing) {
        const newQty = Math.min(existing.qty + qtyToAdd, maxStock)
        return prev.map((item) =>
          Number(item.id) === numId ? { ...item, qty: newQty } : item
        )
      } else {
        const initialQty = Math.min(qtyToAdd, maxStock)
        return [...prev, { id: numId, qty: initialQty }]
      }
    })

    showToast(product.name)
    return true
  }, [products, showToast])

  // Cambiar cantidad de un producto
  const updateQty = useCallback((productId, newQty) => {
    const numId = Number(productId)
    const product = products.find((p) => Number(p.id) === numId)
    if (!product) return

    const maxStock = Math.min(product.stock, 99)
    const clampedQty = Math.max(1, Math.min(newQty, maxStock))

    setRawCart((prev) =>
      prev.map((item) =>
        Number(item.id) === numId ? { ...item, qty: clampedQty } : item
      )
    )
  }, [products])

  // Quitar del carrito con opción de deshacer por 5 segundos
  const removeFromCart = useCallback((productId) => {
    const numId = Number(productId)
    const existing = rawCart.find((item) => Number(item.id) === numId)
    const product = products.find((p) => Number(p.id) === numId)

    if (existing && product) {
      if (undoTimeoutId) clearTimeout(undoTimeoutId)

      setLastRemoved({
        id: numId,
        qty: existing.qty,
        name: product.name,
      })

      const id = setTimeout(() => {
        setLastRemoved(null)
      }, 5000)
      setUndoTimeoutId(id)
    }

    setRawCart((prev) => prev.filter((item) => Number(item.id) !== numId))
  }, [rawCart, products, undoTimeoutId])

  // Deshacer la eliminación
  const undoRemove = useCallback(() => {
    if (lastRemoved) {
      if (undoTimeoutId) clearTimeout(undoTimeoutId)
      setRawCart((prev) => [
        ...prev,
        { id: lastRemoved.id, qty: lastRemoved.qty },
      ])
      setLastRemoved(null)
    }
  }, [lastRemoved, undoTimeoutId])

  const dismissUndo = useCallback(() => {
    if (undoTimeoutId) clearTimeout(undoTimeoutId)
    setLastRemoved(null)
  }, [undoTimeoutId])

  // Vaciar carrito
  const clearCart = useCallback(() => {
    setRawCart([])
    setLastRemoved(null)
  }, [])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        subtotal,
        total,
        addToCart,
        updateQty,
        removeFromCart,
        undoRemove,
        lastRemoved,
        dismissUndo,
        clearCart,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return ctx
}
