import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ProximamenteBadge } from '../components/ProximamenteBadge'

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { level: 1, label: 'Débil', color: 'var(--color-error)' }
  if (score <= 3) return { level: 2, label: 'Media', color: '#d4a017' }
  return { level: 3, label: 'Fuerte', color: 'var(--color-success)' }
}

export function Registro() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const [errorNombre, setErrorNombre] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [errorConfirm, setErrorConfirm] = useState('')
  const [errorTerms, setErrorTerms] = useState('')
  const [errorGeneral, setErrorGeneral] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const strength = getPasswordStrength(password)

  function validate() {
    let ok = true
    setErrorNombre(''); setErrorEmail(''); setErrorPassword('')
    setErrorConfirm(''); setErrorTerms(''); setErrorGeneral('')

    if (!nombre.trim()) { setErrorNombre('Ingresá tu nombre.'); ok = false }
    if (!email.trim()) {
      setErrorEmail('Ingresá tu email.'); ok = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorEmail('El formato del email no es válido.'); ok = false
    }
    if (!password) {
      setErrorPassword('Ingresá una contraseña.'); ok = false
    } else if (password.length < 6) {
      setErrorPassword('La contraseña debe tener al menos 6 caracteres.'); ok = false
    }
    if (!confirmPassword) {
      setErrorConfirm('Repetí la contraseña.'); ok = false
    } else if (password !== confirmPassword) {
      setErrorConfirm('Las contraseñas no coinciden.'); ok = false
    }
    if (!acceptTerms) {
      setErrorTerms('Tenés que aceptar los términos para continuar.'); ok = false
    }
    return ok
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const { puntosBienvenida } = await signUp(email.trim(), password, nombre.trim())
      setSuccessMsg(`¡Bienvenido/a, ${nombre.trim()}! Recibiste ${puntosBienvenida} puntos de bienvenida.`)
    } catch (err) {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('email')) {
        setErrorEmail(msg)
      } else if (msg.toLowerCase().includes('contraseña') || msg.toLowerCase().includes('password')) {
        setErrorPassword(msg)
      } else {
        setErrorGeneral(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  if (successMsg) {
    return (
      <div className="auth-page">
        <div className="auth-success-card" role="status" aria-live="polite">
          <div className="auth-success-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="auth-title">¡Cuenta creada!</h1>
          <p className="auth-success-msg">{successMsg}</p>
          <button
            type="button"
            className="btn-primary auth-submit-btn"
            onClick={() => navigate('/')}
          >
            Ir al inicio
          </button>
        </div>
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

      <h1 className="auth-title">Creá tu cuenta</h1>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Nombre */}
        <div className="auth-field">
          <label htmlFor="reg-nombre" className="auth-label">Nombre</label>
          <input
            id="reg-nombre"
            type="text"
            className={`auth-input ${errorNombre ? 'auth-input--error' : ''}`}
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setErrorNombre('') }}
            autoComplete="name"
            aria-describedby={errorNombre ? 'reg-nombre-error' : undefined}
            aria-invalid={!!errorNombre}
            disabled={loading}
          />
          {errorNombre && (
            <div id="reg-nombre-error" className="auth-field-error" role="alert" aria-live="polite">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorNombre}</span>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="auth-field">
          <label htmlFor="reg-email" className="auth-label">Email</label>
          <input
            id="reg-email"
            type="email"
            className={`auth-input ${errorEmail ? 'auth-input--error' : ''}`}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrorEmail('') }}
            autoComplete="email"
            inputMode="email"
            aria-describedby={errorEmail ? 'reg-email-error' : undefined}
            aria-invalid={!!errorEmail}
            disabled={loading}
          />
          {errorEmail && (
            <div id="reg-email-error" className="auth-field-error" role="alert" aria-live="polite">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorEmail}</span>
            </div>
          )}
        </div>

        {/* Contraseña */}
        <div className="auth-field">
          <label htmlFor="reg-password" className="auth-label">Contraseña</label>
          <div className="auth-input-wrap">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              className={`auth-input auth-input-padded ${errorPassword ? 'auth-input--error' : ''}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorPassword('') }}
              autoComplete="new-password"
              aria-describedby={`reg-strength${errorPassword ? ' reg-password-error' : ''}`}
              aria-invalid={!!errorPassword}
              disabled={loading}
            />
            <button type="button" className="auth-toggle-pass" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>

          {/* Indicador de seguridad */}
          {password && (
            <div id="reg-strength" className="password-strength" aria-live="polite">
              <div className="password-strength-bars">
                {[1, 2, 3].map((lvl) => (
                  <div
                    key={lvl}
                    className="password-strength-bar"
                    style={{ backgroundColor: lvl <= strength.level ? strength.color : 'var(--color-border)' }}
                  />
                ))}
              </div>
              <span className="password-strength-label" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}

          {errorPassword && (
            <div id="reg-password-error" className="auth-field-error" role="alert" aria-live="polite">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errorPassword}</span>
            </div>
          )}
        </div>

        {/* Repetir contraseña */}
        <div className="auth-field">
          <label htmlFor="reg-confirm" className="auth-label">Repetir contraseña</label>
          <div className="auth-input-wrap">
            <input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              className={`auth-input auth-input-padded ${errorConfirm ? 'auth-input--error' : ''}`}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrorConfirm('') }}
              autoComplete="new-password"
              aria-describedby={errorConfirm ? 'reg-confirm-error' : undefined}
              aria-invalid={!!errorConfirm}
              disabled={loading}
            />
            <button type="button" className="auth-toggle-pass" onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {showConfirm ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>
          {errorConfirm && (
            <div id="reg-confirm-error" className="auth-field-error" role="alert" aria-live="polite">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errorConfirm}</span>
            </div>
          )}
        </div>

        {/* Términos */}
        <div className="auth-field auth-field-check">
          <label className="auth-check-label">
            <input
              type="checkbox"
              className="auth-checkbox"
              checked={acceptTerms}
              onChange={(e) => { setAcceptTerms(e.target.checked); setErrorTerms('') }}
              aria-describedby={errorTerms ? 'reg-terms-error' : undefined}
              aria-invalid={!!errorTerms}
              disabled={loading}
            />
            <span>
              Acepto los{' '}
              <Link to="/terminos" target="_blank" rel="noopener noreferrer">
                términos y condiciones
              </Link>
            </span>
          </label>
          {errorTerms && (
            <div id="reg-terms-error" className="auth-field-error" role="alert" aria-live="polite">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{errorTerms}</span>
            </div>
          )}
        </div>

        {/* Error general */}
        {errorGeneral && (
          <div className="auth-field-error auth-error-general" role="alert" aria-live="polite">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <span>{errorGeneral}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary auth-submit-btn"
          disabled={loading}
        >
          {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p className="auth-alt-link">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>

      {/* Acceso social — Próximamente */}
      <div className="auth-social" aria-label="Otras formas de registrarse">
        <p className="auth-social-label">O registrate con</p>
        <div className="auth-social-btns">
          <button type="button" className="auth-social-btn" disabled aria-disabled="true" aria-label="Registrarse con Google (Próximamente)">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span>Google</span>
            <ProximamenteBadge />
          </button>
          <button type="button" className="auth-social-btn" disabled aria-disabled="true" aria-label="Registrarse con Apple (Próximamente)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            <span>Apple</span>
            <ProximamenteBadge />
          </button>
        </div>
      </div>
    </div>
  )
}
