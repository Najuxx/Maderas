import React, { useState, useEffect, useRef } from 'react'

/**
 * Modal de eliminación irreversible de cuenta (Sección 10).
 * Campo de texto real con "Escribí BORRAR para confirmar".
 * Botón "Eliminar cuenta" habilitado ÚNICAMENTE si coincide exactamente.
 */
export function EliminarCuentaModal({ isOpen, onClose, onConfirm, loading = false }) {
  const [confirmText, setConfirmText] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setConfirmText('')
      setTimeout(() => inputRef.current?.focus(), 50)

      function handleKeyDown(e) {
        if (e.key === 'Escape') {
          e.preventDefault()
          onClose()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isMatch = confirmText.trim() === 'BORRAR'

  function handleSubmit(e) {
    e.preventDefault()
    if (isMatch && !loading) {
      onConfirm()
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal-card modal-card--danger"
        role="dialog"
        aria-modal="true"
        aria-labelledby="eliminar-cuenta-title"
        aria-describedby="eliminar-cuenta-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-danger-badge" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 id="eliminar-cuenta-title" className="modal-title modal-title--danger">
            Eliminar cuenta
          </h2>
        </div>

        <p id="eliminar-cuenta-desc" className="modal-desc">
          Esta acción es <strong>definitiva e irreversible</strong>. Se eliminarán permanentemente tus datos de perfil, favoritos guardados, pedidos y puntos acumulados.
        </p>

        <form onSubmit={handleSubmit} className="modal-form">
          <label htmlFor="input-borrar" className="modal-input-label">
            Escribí <strong>BORRAR</strong> para confirmar:
          </label>
          <input
            id="input-borrar"
            ref={inputRef}
            type="text"
            className="auth-input modal-input"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="BORRAR"
            autoComplete="off"
            spellCheck="false"
            disabled={loading}
          />

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary modal-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-danger modal-btn"
              disabled={!isMatch || loading}
            >
              {loading ? 'Eliminando...' : 'Eliminar cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
