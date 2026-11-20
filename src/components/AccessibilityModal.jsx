import React, { useEffect, useRef } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'

export function AccessibilityModal() {
  const {
    prefs,
    setFontSize,
    togglePreference,
    resetPreferences,
    isModalOpen,
    closeModal,
  } = useAccessibility()

  const panelRef = useRef(null)

  // Cerrar con Escape
  useEffect(() => {
    if (!isModalOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, closeModal])

  if (!isModalOpen) return null

  const switches = [
    {
      key: 'theme',
      title: 'Tema oscuro',
      desc: 'Fondo oscuro y texto claro para menor fatiga visual',
      checked: prefs.theme === 'dark',
    },
    {
      key: 'highContrast',
      title: 'Alto contraste',
      desc: 'Textos y bordes más marcados',
      checked: prefs.highContrast,
    },
    {
      key: 'underlineLinks',
      title: 'Subrayar enlaces y botones',
      desc: 'Más fácil distinguir lo que se puede tocar',
      checked: prefs.underlineLinks,
    },
    {
      key: 'textSpacing',
      title: 'Más espacio en el texto',
      desc: 'Más separación entre líneas, letras y palabras',
      checked: prefs.textSpacing,
    },
    {
      key: 'pauseAnimations',
      title: 'Pausar animaciones',
      desc: 'Detiene animaciones y movimientos',
      checked: prefs.pauseAnimations,
    },
    {
      key: 'highlightFocus',
      title: 'Resaltar el foco',
      desc: 'Marca bien dónde estás al usar el teclado',
      checked: prefs.highlightFocus,
    },
  ]

  return (
    <div
      className="a11y-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal()
      }}
      role="presentation"
    >
      <div
        className="a11y-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-title"
      >
        <div className="a11y-header">
          <h2 id="a11y-title" className="a11y-title">Accesibilidad</h2>
          <button
            type="button"
            className="a11y-close-btn"
            onClick={closeModal}
            aria-label="Cerrar panel de accesibilidad"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tamaño de textos: A / A+ / A++ */}
        <div className="a11y-text-size-section">
          <div className="a11y-section-label">Tamaño de textos:</div>
          <div className="a11y-text-size-pills" role="radiogroup" aria-label="Tamaño de texto">
            <button
              type="button"
              className={`a11y-size-btn ${prefs.fontSize === 'normal' ? 'active' : ''}`}
              onClick={() => setFontSize('normal')}
              role="radio"
              aria-checked={prefs.fontSize === 'normal'}
            >
              A
            </button>
            <button
              type="button"
              className={`a11y-size-btn ${prefs.fontSize === 'grande' ? 'active' : ''}`}
              onClick={() => setFontSize('grande')}
              role="radio"
              aria-checked={prefs.fontSize === 'grande'}
            >
              A+
            </button>
            <button
              type="button"
              className={`a11y-size-btn ${prefs.fontSize === 'muy-grande' ? 'active' : ''}`}
              onClick={() => setFontSize('muy-grande')}
              role="radio"
              aria-checked={prefs.fontSize === 'muy-grande'}
            >
              A++
            </button>
          </div>
        </div>

        {/* Interruptores */}
        <div className="a11y-switches-list">
          {switches.map((item) => (
            <div key={item.key} className="a11y-switch-row">
              <div className="a11y-switch-info">
                <span className="a11y-switch-title">{item.title}</span>
                <span className="a11y-switch-desc">{item.desc}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={item.checked}
                aria-label={`${item.title}: ${item.desc}`}
                className="a11y-switch-btn"
                onClick={() => togglePreference(item.key)}
              >
                <span className="a11y-switch-thumb" />
              </button>
            </div>
          ))}
        </div>

        {/* Botón Reiniciar */}
        <button
          type="button"
          className="a11y-reset-btn"
          onClick={resetPreferences}
        >
          Reiniciar
        </button>
      </div>
    </div>
  )
}
