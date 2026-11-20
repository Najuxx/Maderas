import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { FloatingA11yButton } from './FloatingA11yButton'
import { AccessibilityModal } from './AccessibilityModal'
import { CartToast } from './CartToast'

export function Layout() {
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <FloatingA11yButton />
      <AccessibilityModal />
      <CartToast />
    </div>
  )
}
