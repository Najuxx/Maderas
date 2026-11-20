import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { AvatarIcon, AVATAR_OPTIONS } from '../components/AvatarIcon'

const MADERAS_DISPONIBLES = [
  'Nogal',
  'Paraíso',
  'Algarrobo',
  'Eucalipto',
  'Pino'
]

export function PerfilDatos() {
  const { user } = useAuth()

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    ciudad: '',
    apodo: '',
    avatar: 'tronco',
    material_favorito: 'Nogal',
  })

  const [nivel, setNivel] = useState(3)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true

    async function cargarDatos() {
      if (!user) return
      try {
        setLoading(true)
        // 1. Obtener datos de profiles
        const { data: profile, error: profError } = await supabase
          .from('profiles')
          .select('full_name, phone, ciudad, apodo, avatar, material_favorito, nivel')
          .eq('id', user.id)
          .maybeSingle()

        if (profError) throw profError

        // 2. Obtener nivel actualizado desde el servidor
        const { data: estadoData } = await supabase.rpc('mi_estado')

        if (isMounted) {
          if (profile) {
            setForm({
              full_name: profile.full_name || '',
              phone: profile.phone || '',
              ciudad: profile.ciudad || '',
              apodo: profile.apodo || '',
              avatar: profile.avatar || 'tronco',
              material_favorito: profile.material_favorito || 'Nogal',
            })
          }
          if (estadoData && estadoData[0]?.nivel != null) {
            setNivel(estadoData[0].nivel)
          } else if (profile?.nivel != null) {
            setNivel(profile.nivel)
          }
        }
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err)
        if (isMounted) setErrorMsg('No pudimos cargar tus datos. Reintentá.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    cargarDatos()
    return () => {
      isMounted = false
    }
  }, [user])

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setSuccessMsg('')
    setErrorMsg('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      setErrorMsg('')
      setSuccessMsg('')

      // Guardar SOLO las columnas permitidas por RLS, NUNCA 'nivel' ni 'id'
      const payload = {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        ciudad: form.ciudad.trim(),
        apodo: form.apodo.trim(),
        avatar: form.avatar,
        material_favorito: form.material_favorito,
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id)

      if (updateError) throw updateError

      setSuccessMsg('¡Tus datos fueron guardados con éxito!')
    } catch (err) {
      console.error('Error al guardar datos:', err)
      setErrorMsg(err.message || 'Ocurrió un error al guardar. Verificá tu conexión y reintentá.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-section" aria-busy="true" aria-live="polite">
        <div className="skeleton-line" style={{ width: '40%', height: '28px', marginBottom: 'var(--space-3)' }} />
        <div className="skeleton-line" style={{ width: '80%', height: '20px' }} />
      </div>
    )
  }

  return (
    <div className="page-section perfil-datos-page">
      <div className="perfil-back-nav">
        <Link to="/perfil/editar" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Volver a Editar perfil</span>
        </Link>
      </div>

      <div className="perfil-datos-header">
        <h1 className="page-title">Datos del perfil</h1>
        <p className="page-subtitle">
          Personalizá tu información personal y cómo te mostrás en MADERAS.
        </p>
        <div className="perfil-nivel-banner">
          <span className="perfil-nivel-badge">Nivel {nivel}</span>
          <span className="perfil-nivel-text">
            {nivel >= 3
              ? 'Tenés habilitada la personalización completa de avatar, apodo y material favorito.'
              : 'Alcanzá el nivel 3 para desbloquear la personalización completa.'}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="alert-box alert-box--success" role="status" aria-live="polite">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert-box alert-box--error" role="alert" aria-live="assertive">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="perfil-form">
        {/* Sección: Datos Personales */}
        <fieldset className="perfil-fieldset">
          <legend className="perfil-legend">Datos personales</legend>

          <div className="auth-field">
            <label htmlFor="perfil-nombre" className="auth-label">
              Nombre completo
            </label>
            <input
              id="perfil-nombre"
              type="text"
              className="auth-input"
              value={form.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder="Ej. Juan Pérez"
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="perfil-telefono" className="auth-label">
              Teléfono de contacto
            </label>
            <input
              id="perfil-telefono"
              type="tel"
              className="auth-input"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Ej. 11 1234 5678"
              autoComplete="tel"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="perfil-ciudad" className="auth-label">
              Ciudad / Localidad
            </label>
            <input
              id="perfil-ciudad"
              type="text"
              className="auth-input"
              value={form.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              placeholder="Ej. Córdoba, Argentina"
              autoComplete="address-level2"
            />
          </div>
        </fieldset>

        {/* Sección: Personalización (Sección 10 - requiere nivel 3) */}
        <fieldset className="perfil-fieldset">
          <legend className="perfil-legend">Personalización</legend>

          <div className="auth-field">
            <label htmlFor="perfil-apodo" className="auth-label">
              Apodo o alias público
            </label>
            <input
              id="perfil-apodo"
              type="text"
              className="auth-input"
              value={form.apodo}
              onChange={(e) => handleChange('apodo', e.target.value)}
              placeholder="Ej. El Carpintero"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="perfil-material" className="auth-label">
              Material favorito
            </label>
            <select
              id="perfil-material"
              className="auth-input perfil-select"
              value={form.material_favorito}
              onChange={(e) => handleChange('material_favorito', e.target.value)}
            >
              {MADERAS_DISPONIBLES.map((madera) => (
                <option key={madera} value={madera}>
                  {madera}
                </option>
              ))}
            </select>
          </div>

          {/* Selector visual de Avatar (8 opciones SVG) */}
          <div className="auth-field">
            <label id="label-avatar-group" className="auth-label">
              Elegí tu avatar artesanal
            </label>
            <div
              className="avatar-grid"
              role="radiogroup"
              aria-labelledby="label-avatar-group"
            >
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = form.avatar === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Avatar ${opt.label}`}
                    className={`avatar-option-btn ${isSelected ? 'avatar-option-btn--selected' : ''}`}
                    onClick={() => handleChange('avatar', opt.id)}
                  >
                    <AvatarIcon name={opt.id} size={44} />
                    <span className="avatar-option-name">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </fieldset>

        <div className="perfil-form-actions">
          <button
            type="submit"
            className="btn btn-primary perfil-submit-btn"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
