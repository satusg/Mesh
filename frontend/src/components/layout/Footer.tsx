export function Footer() {
  return (
    <footer className="border-t border-white/6 bg-[#050816]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-xs font-semibold text-slate-100">
              U
            </span>
            <div>
              <p className="font-serif text-2xl text-white">USDC Coin</p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Physical object. Quiet transaction.</p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} USDC Coin. All rights reserved.
          </p>

          <div className="flex gap-5 text-sm text-slate-500">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="mailto:support@usdccoin.shop" className="hover:text-white">Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
