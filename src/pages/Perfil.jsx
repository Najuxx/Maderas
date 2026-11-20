import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { AvatarIcon } from '../components/AvatarIcon'
import { ProximamenteBadge } from '../components/ProximamenteBadge'
import { CerrarSesionModal } from '../components/CerrarSesionModal'

/**
 * Pantalla principal de Perfil (Sección 6, 7 & 10).
 * Muestra avatar, apodo/nombre, menú de opciones con saldo de puntos y botón neutro de cerrar sesión.
 */
export function Perfil() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [perfil, setPerfil] = useState(null)
  const [estado, setEstado] = useState({ puntos: 0, descuento_pct: 0, nivel: 3 })
  const [loading, setLoading] = useState(true)
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function cargarDatosPerfil() {
      if (!user) return
      try {
        setLoading(true)
        // 1. Obtener perfil
        const { data: perfilData } = await supabase
          .from('profiles')
          .select('full_name, apodo, avatar, ciudad, material_favorito')
          .eq('id', user.id)
          .maybeSingle()

        // 2. Obtener estado de puntos y nivel (calculado en servidor)
        const { data: estadoData } = await supabase.rpc('mi_estado')

        if (isMounted) {
          if (perfilData) setPerfil(perfilData)
          if (estadoData && estadoData[0]) {
            setEstado({
              puntos: estadoData[0].puntos ?? 0,
              descuento_pct: estadoData[0].descuento_pct ?? 0,
              nivel: estadoData[0].nivel ?? 3,
            })
          }
        }
      } catch (err) {
        console.error('Error al cargar datos del perfil:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    cargarDatosPerfil()

    return () => {
      isMounted = false
    }
  }, [user])

  async function handleConfirmSignOut() {
    try {
      setSigningOut(true)
      await signOut()
      setIsSignOutModalOpen(false)
      navigate('/')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
      setSigningOut(false)
    }
  }

  const displayName = perfil?.apodo || perfil?.full_name || user?.email?.split('@')[0] || 'Usuario'
  const email = user?.email || ''
  const avatarKey = perfil?.avatar || 'tronco'

  return (
    <div className="page-section perfil-page">
      {/* Encabezado del perfil con avatar y datos */}
      <div className="perfil-header-card">
        <div className="perfil-avatar-wrap">
          <AvatarIcon name={avatarKey} size={72} />
        </div>
        <div className="perfil-header-info">
          <h1 className="perfil-nombre">{displayName}</h1>
          <p className="perfil-email">{email}</p>
          <div className="perfil-badges">
            <span className="perfil-badge-nivel">Nivel {estado.nivel}</span>
            <span className="perfil-badge-puntos">{estado.puntos.toLocaleString('es-AR')} puntos</span>
          </div>
        </div>
      </div>

      {/* Menú principal de opciones */}
      <nav className="perfil-menu" aria-label="Menú del perfil">
        {/* Puntos y nivel */}
        <Link to="/perfil/puntos" className="perfil-menu-item">
          <div className="perfil-menu-left">
            <div className="perfil-menu-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="perfil-menu-text">
              <span className="perfil-menu-title">Puntos y nivel</span>
              <span className="perfil-menu-sub">{estado.puntos.toLocaleString('es-AR')} pts · {estado.descuento_pct}% de descuento</span>
            </div>
          </div>
          <svg className="perfil-menu-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Editar perfil */}
        <Link to="/perfil/editar" className="perfil-menu-item">
          <div className="perfil-menu-left">
            <div className="perfil-menu-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div className="perfil-menu-text">
              <span className="perfil-menu-title">Editar perfil</span>
              <span className="perfil-menu-sub">Datos personales y personalización</span>
            </div>
          </div>
          <svg className="perfil-menu-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Favoritos */}
        <Link to="/favoritos" className="perfil-menu-item">
          <div className="perfil-menu-left">
            <div className="perfil-menu-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div className="perfil-menu-text">
              <span className="perfil-menu-title">Favoritos</span>
              <span className="perfil-menu-sub">Piezas que guardaste</span>
            </div>
          </div>
          <svg className="perfil-menu-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Mis pedidos (Próximamente) */}
        <div className="perfil-menu-item perfil-menu-item--disabled" aria-disabled="true">
          <div className="perfil-menu-left">
            <div className="perfil-menu-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="perfil-menu-text">
              <span className="perfil-menu-title">Mis pedidos</span>
              <span className="perfil-menu-sub">Historial de compras</span>
            </div>
          </div>
          <ProximamenteBadge />
        </div>

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
              <span className="perfil-menu-sub">Preferencias de avisos</span>
            </div>
          </div>
          <ProximamenteBadge />
        </Link>

        {/* Preguntas frecuentes */}
        <Link to="/faq" className="perfil-menu-item">
          <div className="perfil-menu-left">
            <div className="perfil-menu-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="perfil-menu-text">
              <span className="perfil-menu-title">Preguntas frecuentes</span>
            </div>
          </div>
          <svg className="perfil-menu-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Términos y condiciones */}
        <Link to="/terminos" className="perfil-menu-item">
          <div className="perfil-menu-left">
            <div className="perfil-menu-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="perfil-menu-text">
              <span className="perfil-menu-title">Términos y condiciones</span>
            </div>
          </div>
          <svg className="perfil-menu-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </nav>

      {/* Cerrar sesión separado, con estilo neutro (Sección 10) */}
      <div className="perfil-signout-wrap">
        <button
          type="button"
          className="btn btn-secondary perfil-signout-btn"
          onClick={() => setIsSignOutModalOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* Modal neutro de confirmación */}
      <CerrarSesionModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleConfirmSignOut}
        loading={signingOut}
      />
    </div>
  )
}
