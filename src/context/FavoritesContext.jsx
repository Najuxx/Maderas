import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(false)

  // Cargar favoritos cuando el usuario inicia sesión
  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set())
      return
    }

    async function loadFavorites() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('product_id')
          .eq('user_id', user.id)

        if (!error && data) {
          setFavoriteIds(new Set(data.map((f) => f.product_id)))
        }
      } catch (err) {
        console.error('Error al cargar favoritos:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [user])

  const isFavorite = useCallback(
    (productId) => favoriteIds.has(productId),
    [favoriteIds]
  )

  // Alternar favorito con UI optimista y rollback en error
  const toggleFavorite = useCallback(
    async (productId) => {
      if (!user) return false // Caller debe mostrar el bottom sheet

      const wasFavorite = favoriteIds.has(productId)

      // UI optimista
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (wasFavorite) {
          next.delete(productId)
        } else {
          next.add(productId)
        }
        return next
      })

      try {
        if (wasFavorite) {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId)
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('favorites')
            .insert({ user_id: user.id, product_id: productId })
          if (error) throw error
        }
        return true
      } catch (err) {
        console.error('Error al actualizar favorito:', err)
        // Rollback
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          if (wasFavorite) {
            next.add(productId)
          } else {
            next.delete(productId)
          }
          return next
        })
        return false
      }
    },
    [user, favoriteIds]
  )

  const value = { favoriteIds, loading, isFavorite, toggleFavorite }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites debe usarse dentro de FavoritesProvider')
  return ctx
}
