import React, { useEffect, useRef } from 'react'

export function ProductZoomModal({ isOpen, onClose, imageSrc, altText, triggerRef }) {
  const closeButtonRef = useRef(null)
  const modalRef = useRef(null)

  // Manejo de tecla Escape y trampa de foco
  useEffect(() => {
    if (!isOpen) return

    // Guardar elemento previo y enfocar el botón de cerrar
    closeButtonRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Tab') {
        // Trampa de foco: mantener el foco en los elementos interactivos del modal
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      // Restaurar el foco al elemento que abrió el modal
      if (triggerRef?.current) {
        triggerRef.current.focus()
      }
    }
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) return null

  return (
    <div
      className="zoom-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen ampliada de ${altText || 'producto'}`}
      ref={modalRef}
    >
      <div className="zoom-modal-container">
        {/* Botón de cierre de 48 px */}
        <button
          type="button"
          className="zoom-close-btn"
          onClick={onClose}
          ref={closeButtonRef}
          aria-label="Cerrar imagen ampliada"
          title="Cerrar (Escape)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="zoom-image-wrapper">
          <img
            src={imageSrc}
            alt={altText || 'Pieza de madera en vista ampliada'}
            className="zoom-image"
          />
        </div>
      </div>
    </div>
  )
}
