import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LandingPage } from '@/pages/LandingPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ConfirmationPage } from '@/pages/ConfirmationPage'
import { BackofficePage } from '@/pages/BackofficePage'

export function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />

        <div className="flex-1">
          <Routes>
            <Route path="/"                      element={<LandingPage />} />
            <Route path="/checkout"              element={<CheckoutPage />} />
            <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
            <Route path="/backoffice"            element={<BackofficePage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  )
}
