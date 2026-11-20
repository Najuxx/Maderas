import React, { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'maderas_a11y_prefs'

const DEFAULT_PREFS = {
  theme: 'light', // 'light' | 'dark'
  fontSize: 'normal', // 'normal' (A) | 'grande' (A+) | 'muy-grande' (A++)
  highContrast: false,
  underlineLinks: false,
  textSpacing: false,
  pauseAnimations: false,
  highlightFocus: false,
}

// Cargar estado inicial seguro desde localStorage respetando prefers-color-scheme / prefers-reduced-motion
function getInitialPrefs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...DEFAULT_PREFS, ...JSON.parse(saved) }
    }
  } catch (err) {
    console.warn('No se pudo acceder a localStorage para leer accesibilidad:', err)
  }

  // Fallback con detección del sistema operativo si no hay preferencia guardada
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return {
    ...DEFAULT_PREFS,
    theme: prefersDark ? 'dark' : 'light',
    pauseAnimations: prefersReducedMotion,
  }
}

const AccessibilityContext = createContext(null)

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(getInitialPrefs)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Aplicar atributos a <html> cada vez que cambien las preferencias
  useEffect(() => {
    const root = document.documentElement

    // 1. Tema
    root.setAttribute('data-theme', prefs.theme)

    // 2. Tamaño de texto
    root.setAttribute('data-texto', prefs.fontSize)

    // 3. Alto contraste
    if (prefs.highContrast) {
      root.setAttribute('data-contraste', 'alto')
    } else {
      root.removeAttribute('data-contraste')
    }

    // 4. Subrayar enlaces y botones
    if (prefs.underlineLinks) {
      root.setAttribute('data-subrayado', 'true')
    } else {
      root.removeAttribute('data-subrayado')
    }

    // 5. Más espacio en el texto
    if (prefs.textSpacing) {
      root.setAttribute('data-espaciado', 'amplio')
    } else {
      root.removeAttribute('data-espaciado')
    }

    // 6. Pausar animaciones
    if (prefs.pauseAnimations) {
      root.setAttribute('data-animaciones', 'pausadas')
    } else {
      root.removeAttribute('data-animaciones')
    }

    // 7. Resaltar foco
    if (prefs.highlightFocus) {
      root.setAttribute('data-foco', 'resaltado')
    } else {
      root.removeAttribute('data-foco')
    }

    // Guardar en localStorage dentro de try/catch
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch (err) {
      console.warn('No se pudo guardar la accesibilidad en localStorage:', err)
    }
  }, [prefs])

  const setFontSize = (size) => {
    setPrefs((prev) => ({ ...prev, fontSize: size }))
  }

  const togglePreference = (key) => {
    setPrefs((prev) => {
      if (key === 'theme') {
        return { ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }
      }
      return { ...prev, [key]: !prev[key] }
    })
  }

  const resetPreferences = () => {
    setPrefs({ ...DEFAULT_PREFS })
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <AccessibilityContext.Provider
      value={{
        prefs,
        setFontSize,
        togglePreference,
        resetPreferences,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) {
    throw new Error('useAccessibility debe usarse dentro de un AccessibilityProvider')
  }
  return ctx
}
