import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { pathname } = useLocation()
  const isCheckout = pathname.startsWith('/checkout') || pathname.startsWith('/confirmation')
  const isBackoffice = pathname.startsWith('/backoffice')

  return (
    <header className="sticky top-0 z-40 border-b border-white/6 bg-[#050816]/72 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-xs font-semibold text-slate-100 transition-colors group-hover:border-white/24">
            U
          </span>
          <span className="font-serif text-2xl tracking-tight text-white">
            USDC Coin
          </span>
        </Link>

        {!isCheckout && !isBackoffice && (
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
            <a href="#features" className="hover:text-white">Object</a>
            <a href="#pricing" className="hover:text-white">Purchase</a>
            <a href="#faq" className="hover:text-white">Notes</a>
          </nav>
        )}

        {!isCheckout && !isBackoffice && (
          <Link to="/checkout">
            <Button size="sm">Acquire</Button>
          </Link>
        )}

        {isCheckout && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <svg className="h-4 w-4 text-[#9dd6ff]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure session
          </div>
        )}

        {isBackoffice && (
          <div className="text-sm text-slate-400">Operations</div>
        )}
      </div>
    </header>
  )
}
