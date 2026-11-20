import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAccessibility } from '../context/AccessibilityContext'

export function FloatingA11yButton() {
  const { openModal, isModalOpen } = useAccessibility()
  const location = useLocation()

  // Sección 5 y 10: "El botón no aparece en login, registro, skeleton ni dentro de modales y paneles."
  const isHiddenRoute = ['/login', '/registro'].includes(location.pathname)

  if (isHiddenRoute || isModalOpen) {
    return null
  }

  return (
    <button
      type="button"
      className="floating-a11y-btn"
      onClick={openModal}
      aria-label="Abrir panel de accesibilidad"
      title="Accesibilidad"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v8" />
        <path d="M5 10l7-2 7 2" />
        <path d="M9 21l3-6 3 6" />
      </svg>
    </button>
  )
}
