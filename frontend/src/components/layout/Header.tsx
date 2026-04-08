import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { pathname } = useLocation()
  const isCheckout = pathname.startsWith('/checkout') || pathname.startsWith('/confirmation')

  return (
    <header>
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9c7a5] bg-[#f4ead7] text-xs font-semibold text-[#7a5b2f] transition-colors group-hover:border-[#cbb086]">
            U
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight text-gray-950">
            USDC Coin
          </span>
        </Link>

        {!isCheckout && (
          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="#features" className="transition-colors hover:text-gray-950">Details</a>
            <a href="#pricing"  className="transition-colors hover:text-gray-950">Pricing</a>
            <a href="#faq"      className="transition-colors hover:text-gray-950">FAQ</a>
          </nav>
        )}

        {!isCheckout && (
          <Link to="/checkout">
            <Button size="sm">Order now</Button>
          </Link>
        )}

        {isCheckout && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="h-4 w-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure checkout
          </div>
        )}
      </div>
    </header>
  )
}
