import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { ProximamenteBadge } from '../components/ProximamenteBadge'
import { EliminarCuentaModal } from '../components/EliminarCuentaModal'

/**
 * Pantalla de opciones editables del perfil (Sección 6 & 10).
 * Secciones: Datos personales, Personalización, Notificaciones (Próximamente)
 * y separado abajo: "Eliminar cuenta".
 */
export function PerfilEditar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  async function handleConfirmDelete() {
    try {
      setDeleting(true)
      setDeleteError(null)

      // 1. Invocar función del servidor en Supabase
      const { error: rpcError } = await supabase.rpc('eliminar_mi_cuenta')
      if (rpcError) throw rpcError

      // 2. Cerrar sesión localmente
      await signOut()

      setIsDeleteModalOpen(false)
      // 3. Volver al inicio con aviso
      navigate('/', { state: { aviso: 'Tu cuenta ha sido eliminada correctamente.' } })
    } catch (err) {
      console.error('Error al eliminar la cuenta:', err)
      setDeleteError(err.message || 'No pudimos eliminar tu cuenta. Por favor, reintentá.')
      setDeleting(false)
    }
  }

  return (
    <div className="page-section perfil-editar-page">
      <div className="perfil-back-nav">
        <Link to="/perfil" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Volver al perfil</span>
        </Link>
      </div>

      <h1 className="page-title">Editar perfil</h1>
      <p className="page-subtitle">
        Gestioná tus datos personales, preferencias de visualización y cuenta.
      </p>

      {deleteError && (
        <div className="alert-box alert-box--error" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{deleteError}</span>
        </div>
      )}

      {/* Lista de secciones editables */}
      <div className="perfil-edit-list">
        {/* Datos personales */}
        <Link to="/perfil/datos" className="perfil-menu-item">
          <div className="perfil-menu-left">
            <div className="perfil-menu-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="perfil-menu-text">
              <span className="perfil-menu-title">Datos personales</span>
              <span className="perfil-menu-sub">Nombre, teléfono y ciudad</span>
            </div>
          </div>
          <svg className="perfil-menu-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Personalización (requiere nivel 3) */}
        <Link to="/perfil/datos" className="perfil-menu-item">
          <div className="perfil-menu-left">
            <div className="perfil-menu-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a7 7 0 0 0 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
              </svg>
            </div>
            <div className="perfil-menu-text">
              <span className="perfil-menu-title">Personalización</span>
              <span className="perfil-menu-sub">Apodo, avatar y madera favorita</span>
            </div>
          </div>
          <svg className="perfil-menu-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Notificaciones (Próximamente) */}
        <Link to="/perfil/notificaciones" className="perfil-menu-item">
          <div className="perfil-menu-left">
            <div className="perfil-menu-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div className="perfil-menu-text">
              <span className="perfil-menu-title">Notificaciones</span>
              <span className="perfil-menu-sub">Preferencias de canales</span>
            </div>
          </div>
          <ProximamenteBadge />
        </Link>
      </div>

      {/* Sección separada para Eliminar cuenta (Sección 10) */}
      <div className="perfil-danger-zone">
        <h2 className="perfil-danger-title">Zona de peligro</h2>
        <p className="perfil-danger-desc">
          Si decidís dar de baja tu cuenta, se eliminarán tus datos, favoritos, historial y puntos acumulados.
        </p>
        <button
          type="button"
          className="btn btn-danger-outline perfil-danger-btn"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Eliminar cuenta</span>
        </button>
      </div>

      {/* Modal de confirmación con tipeo de BORRAR */}
      <EliminarCuentaModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  )
}
