import React, { useEffect, useRef } from 'react'

/**
 * Modal neutro de confirmación para cerrar sesión (Sección 10).
 * Tamaño normal, con "Cancelar" y "Cerrar sesión" (sin color rojo).
 */
export function CerrarSesionModal({ isOpen, onClose, onConfirm, loading = false }) {
  const modalRef = useRef(null)
  const cancelBtnRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    // Foco en botón Cancelar al abrir
    cancelBtnRef.current?.focus()

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal-card"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cerrar-sesion-title"
        aria-describedby="cerrar-sesion-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="cerrar-sesion-title" className="modal-title">¿Cerrar sesión?</h2>
        </div>

        <p id="cerrar-sesion-desc" className="modal-desc">
          Vas a salir de tu cuenta en este dispositivo. Podés volver a ingresar en cualquier momento con tu email y contraseña.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            ref={cancelBtnRef}
            className="btn btn-secondary modal-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary modal-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Cerrando...' : 'Cerrar sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}
