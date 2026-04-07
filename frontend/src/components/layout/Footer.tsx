export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white font-bold text-xs">
              M
            </span>
            <span className="font-semibold text-gray-900 text-sm">
              Mesh<span className="text-brand-600">Pro</span>
            </span>
          </div>

          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} MeshPro. All rights reserved.
          </p>

          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="mailto:support@meshpro.dev" className="hover:text-gray-900 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
