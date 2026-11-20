import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // Solo las columnas necesarias de la tabla products
      const { data, error: err } = await supabase
        .from('products')
        .select('id, name, description, price, category, material, image_url, stock, featured, created_at')
        .order('id', { ascending: true })

      if (err) throw err
      setProducts(data || [])
    } catch (err) {
      console.error('Error al cargar productos de Supabase:', err)
      setError(err.message || 'No pudimos cargar el catálogo de productos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Categorías y materiales extraídos directamente de los datos
  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))]
  const materials = Array.from(new Set(products.map((p) => p.material).filter(Boolean)))
  const featuredProducts = products.filter((p) => p.featured)

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        materials,
        featuredProducts,
        loading,
        error,
        refetch: fetchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) {
    throw new Error('useProducts debe ser utilizado dentro de un ProductsProvider')
  }
  return ctx
}
