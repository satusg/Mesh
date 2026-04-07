import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { pathname } = useLocation()
  const isCheckout = pathname.startsWith('/checkout') || pathname.startsWith('/confirmation')

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm group-hover:bg-brand-700 transition-colors">
            M
          </span>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            Mesh<span className="text-brand-600">Pro</span>
          </span>
        </Link>

        {/* Nav */}
        {!isCheckout && (
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing"  className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#faq"      className="hover:text-gray-900 transition-colors">FAQ</a>
          </nav>
        )}

        {/* CTA */}
        {!isCheckout && (
          <Link to="/checkout">
            <Button size="sm">Get MeshPro →</Button>
          </Link>
        )}

        {isCheckout && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure checkout
          </div>
        )}
      </div>
    </header>
  )
}
