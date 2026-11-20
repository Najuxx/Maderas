import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Panel inferior que se muestra cuando un invitado intenta acceder
 * a una función que requiere cuenta (favoritos, puntos, perfil).
 *
 * Props:
 *   isOpen     - booleano
 *   onClose    - función para cerrarlo
 *   triggerRef - ref opcional al elemento disparador (ej. botón de corazón)
 *                para devolver el foco accesible al cerrarse.
 */
export function AccountBottomSheet({ isOpen, onClose, triggerRef }) {
  const navigate = useNavigate()
  const sheetRef = useRef(null)
  const closeRef = useRef(null)
  const prevActiveElementRef = useRef(null)

  // Guardar elemento activo previo y mover foco al botón de descarte accesible
  useEffect(() => {
    if (isOpen) {
      prevActiveElementRef.current = triggerRef?.current || document.activeElement
      // Pequeño timeout para asegurar que el modal se renderizó
      const timer = setTimeout(() => {
        closeRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen, triggerRef])

  // Devolver foco al elemento disparador al cerrarse
  function handleDismiss() {
    onClose()
    setTimeout(() => {
      if (triggerRef?.current) {
        triggerRef.current.focus?.()
      } else if (prevActiveElementRef.current) {
        prevActiveElementRef.current.focus?.()
      }
    }, 50)
  }

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleDismiss()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen]) // eslint-disable-line

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  function handleRegister() {
    onClose()
    navigate('/registro')
  }

  function handleLogin() {
    onClose()
    navigate('/login')
  }

  return (
    <div
      className="bottom-sheet-overlay"
      onClick={handleDismiss}
      role="presentation"
    >
      <div
        ref={sheetRef}
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tirador visual */}
        <div className="bottom-sheet-drag-handle" aria-hidden="true" />

        <div className="bottom-sheet-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h2 id="account-sheet-title" className="bottom-sheet-title">
          Necesitás una cuenta
        </h2>
        <p className="bottom-sheet-desc">
          Guardá tus piezas favoritas, sumá puntos con cada compra y accedé a descuentos.
        </p>

        <div className="bottom-sheet-actions">
          <button
            type="button"
            className="btn btn-primary bottom-sheet-btn"
            onClick={handleRegister}
          >
            Crear cuenta
          </button>
          <button
            type="button"
            className="btn btn-secondary bottom-sheet-btn"
            onClick={handleLogin}
          >
            Iniciar sesión
          </button>
          <button
            ref={closeRef}
            type="button"
            className="bottom-sheet-dismiss"
            onClick={handleDismiss}
            aria-label="Cerrar panel y continuar sin cuenta"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook para requerir autenticación en acciones:
 * Abre el panel siempre que un invitado active una función protegida.
 */
export function useGuestGuard(user, { onOpen }) {
  function requireAuth(action) {
    if (user) {
      action()
      return
    }
    onOpen()
  }

  return { requireAuth }
}
