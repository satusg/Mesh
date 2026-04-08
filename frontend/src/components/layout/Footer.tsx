export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#f1ece4]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d9c7a5] bg-[#f4ead7] text-xs font-semibold text-[#7a5b2f]">
              U
            </span>
            <div>
              <p className="font-serif text-lg font-semibold text-gray-950">USDC Coin</p>
              <p className="text-xs text-gray-500">A physical collector coin with a calmer, retail-style buying experience.</p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} USDC Coin. All rights reserved.
          </p>

          <div className="flex gap-5 text-sm text-gray-500">
            <a href="#" className="transition-colors hover:text-gray-950">Privacy</a>
            <a href="#" className="transition-colors hover:text-gray-950">Terms</a>
            <a href="mailto:support@usdccoin.shop" className="transition-colors hover:text-gray-950">Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
