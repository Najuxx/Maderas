import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Traduce los mensajes de error de Supabase al español rioplatense
function traducirError(error) {
  if (!error) return 'Ocurrió un error inesperado.'
  const msg = (error.message || '').toLowerCase()

  if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
    return 'El email o la contraseña son incorrectos.'
  }
  if (msg.includes('user already registered') || msg.includes('already registered')) {
    return 'Ya existe una cuenta con ese email.'
  }
  if (msg.includes('password should be at least') || msg.includes('password must be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.'
  }
  if (msg.includes('email not confirmed')) {
    return 'Confirmá tu email antes de iniciar sesión.'
  }
  if (msg.includes('invalid email')) {
    return 'El formato del email no es válido.'
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) {
    return 'Error de conexión. Verificá tu internet y reintentá.'
  }
  if (msg.includes('email rate limit') || msg.includes('too many requests')) {
    return 'Demasiados intentos. Esperá unos minutos y volvé a intentarlo.'
  }
  if (msg.includes('token expired') || msg.includes('token has expired')) {
    return 'El enlace venció. Pedí uno nuevo.'
  }
  if (msg.includes('same password')) {
    return 'La nueva contraseña no puede ser igual a la anterior.'
  }
  return error.message || 'Ocurrió un error inesperado.'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Registrarse
  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    if (error) throw new Error(traducirError(error))

    // Intentar leer puntos de bienvenida (puede tardar unos segundos en crearse el perfil)
    let puntosBienvenida = 500
    try {
      const { data: estado } = await supabase.rpc('mi_estado')
      if (estado && estado[0]?.puntos != null) {
        puntosBienvenida = estado[0].puntos
      }
    } catch (_) {
      // Si falla (perfil aún no creado), devolvemos 500 como valor por defecto
    }

    return { user: data.user, session: data.session, puntosBienvenida }
  }

  // Iniciar sesión
  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(traducirError(error))
    return data
  }

  // Cerrar sesión
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(traducirError(error))
  }

  // Enviar email de recuperación
  async function sendPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer`,
    })
    if (error) throw new Error(traducirError(error))
  }

  // Actualizar contraseña (desde la pantalla de restablecimiento)
  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw new Error(traducirError(error))
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    sendPasswordReset,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
