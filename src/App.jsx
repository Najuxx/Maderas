import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'

// Páginas de la aplicación (Sección 6)
import { Home } from './pages/Home'
import { Catalogo } from './pages/Catalogo'
import { ProductoDetalle } from './pages/ProductoDetalle'
import { Favoritos } from './pages/Favoritos'
import { Carrito } from './pages/Carrito'
import { ConfirmarPedido } from './pages/ConfirmarPedido'
import { PedidoEnviado } from './pages/PedidoEnviado'
import { PedidoError } from './pages/PedidoError'
import { Login } from './pages/Login'
import { Registro } from './pages/Registro'
import { RecuperarContrasena } from './pages/RecuperarContrasena'
import { RestablecerContrasena } from './pages/RestablecerContrasena'
import { Perfil } from './pages/Perfil'
import { PerfilEditar } from './pages/PerfilEditar'
import { PerfilDatos } from './pages/PerfilDatos'
import { PerfilPuntos } from './pages/PerfilPuntos'
import { PerfilNotificaciones } from './pages/PerfilNotificaciones'
import { PedidoSeguimiento } from './pages/PedidoSeguimiento'
import { Faq } from './pages/Faq'
import { Terminos } from './pages/Terminos'
import { Diseno } from './pages/Diseno'
import { Proximamente } from './pages/Proximamente'
import { NotFound } from './pages/NotFound'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas principales */}
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/favoritos" element={<Favoritos />} />
        
        {/* Carrito y flujo de pedido */}
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/carrito/confirmar" element={<ConfirmarPedido />} />
        <Route path="/pedido-enviado" element={<PedidoEnviado />} />
        <Route path="/pedido-error" element={<PedidoError />} />
        <Route path="/pedido-seguimiento" element={<PedidoSeguimiento />} />

        {/* Autenticación y cuenta */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<RecuperarContrasena />} />
        <Route path="/restablecer" element={<RestablecerContrasena />} />

        {/* Perfil */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfil/editar" element={<PerfilEditar />} />
        <Route path="/perfil/datos" element={<PerfilDatos />} />
        <Route path="/perfil/puntos" element={<PerfilPuntos />} />
        <Route path="/perfil/notificaciones" element={<PerfilNotificaciones />} />

        {/* Información y diseño */}
        <Route path="/faq" element={<Faq />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/diseno" element={<Diseno />} />

        {/* Próximamente y 404 */}
        <Route path="/proximamente" element={<Proximamente />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
