import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function RestablecerContrasena() {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()

  const [ready, setReady] = useState(false)       // token válido recibido
  const [invalid, setInvalid] = useState(false)   // token inválido o vencido
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errorPassword, setErrorPassword] = useState('')
  const [errorConfirm, setErrorConfirm] = useState('')
  const [errorGeneral, setErrorGeneral] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Escuchar el evento PASSWORD_RECOVERY que llega desde Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
      if (event === 'SIGNED_OUT') {
        setInvalid(true)
      }
    })

    // Si hay un hash de acceso en la URL, Supabase lo procesa automáticamente
    // y dispara PASSWORD_RECOVERY. Damos 3 segundos por si tarda.
    const timeout = setTimeout(() => {
      if (!ready) setInvalid(true)
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, []) // eslint-disable-line

  function validate() {
    let ok = true
    setErrorPassword(''); setErrorConfirm('')
    if (!password) { setErrorPassword('Ingresá tu nueva contraseña.'); ok = false }
    else if (password.length < 6) { setErrorPassword('La contraseña debe tener al menos 6 caracteres.'); ok = false }
    if (!confirmPassword) { setErrorConfirm('Repetí la contraseña.'); ok = false }
    else if (password !== confirmPassword) { setErrorConfirm('Las contraseñas no coinciden.'); ok = false }
    return ok
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrorGeneral('')
    try {
      await updatePassword(password)
      navigate('/login', { state: { resetOk: true } })
    } catch (err) {
      setErrorGeneral(err.message || 'No se pudo actualizar la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  // Token inválido o vencido
  if (invalid) {
    return (
      <div className="auth-page">
        <div className="auth-success-card">
          <div className="auth-success-icon auth-error-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="auth-title">Enlace vencido</h1>
          <p className="auth-success-msg">
            Este enlace ya no es válido o venció. Pedí uno nuevo desde la pantalla de recuperación.
          </p>
          <Link to="/recuperar" className="btn-primary auth-submit-btn" style={{ textAlign: 'center', display: 'block' }}>
            Pedir nuevo enlace
          </Link>
        </div>
      </div>
    )
  }

  // Esperando el evento PASSWORD_RECOVERY
  if (!ready) {
    return (
      <div className="auth-page">
        <div className="auth-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h6" />
          </svg>
          <span>MADERAS</span>
        </div>
        <p className="auth-subtitle" aria-live="polite">Verificando enlace…</p>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h6" />
        </svg>
        <span>MADERAS</span>
      </div>

      <h1 className="auth-title">Nueva contraseña</h1>
      <p className="auth-subtitle">Elegí una contraseña nueva para tu cuenta.</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Nueva contraseña */}
        <div className="auth-field">
          <label htmlFor="reset-password" className="auth-label">Nueva contraseña</label>
          <div className="auth-input-wrap">
            <input
              id="reset-password"
              type={showPassword ? 'text' : 'password'}
              className={`auth-input auth-input-padded ${errorPassword ? 'auth-input--error' : ''}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorPassword('') }}
              autoComplete="new-password"
              aria-describedby={errorPassword ? 'reset-password-error' : undefined}
              aria-invalid={!!errorPassword}
              disabled={loading}
            />
            <button type="button" className="auth-toggle-pass" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {showPassword
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              }
            </button>
          </div>
          {errorPassword && (
            <div id="reset-password-error" className="auth-field-error" role="alert" aria-live="polite">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errorPassword}</span>
            </div>
          )}
        </div>

        {/* Repetir contraseña */}
        <div className="auth-field">
          <label htmlFor="reset-confirm" className="auth-label">Repetir contraseña</label>
          <div className="auth-input-wrap">
            <input
              id="reset-confirm"
              type={showConfirm ? 'text' : 'password'}
              className={`auth-input auth-input-padded ${errorConfirm ? 'auth-input--error' : ''}`}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrorConfirm('') }}
              autoComplete="new-password"
              aria-describedby={errorConfirm ? 'reset-confirm-error' : undefined}
              aria-invalid={!!errorConfirm}
              disabled={loading}
            />
            <button type="button" className="auth-toggle-pass" onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {showConfirm
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              }
            </button>
          </div>
          {errorConfirm && (
            <div id="reset-confirm-error" className="auth-field-error" role="alert" aria-live="polite">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errorConfirm}</span>
            </div>
          )}
        </div>

        {errorGeneral && (
          <div className="auth-field-error auth-error-general" role="alert" aria-live="polite">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <span>{errorGeneral}</span>
          </div>
        )}

        <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
          {loading ? 'Guardando…' : 'Guardar contraseña'}
        </button>
      </form>
    </div>
  )
}
