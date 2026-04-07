import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-brand-800 px-4 py-24 text-center sm:px-6 sm:py-32">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-4xl animate-fade-in">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-600/30 bg-brand-800/50 px-4 py-1.5 text-sm font-medium text-brand-200">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          v2.0 — Now with 50+ components
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Build faster with{' '}
          <span className="bg-gradient-to-r from-brand-300 to-indigo-300 bg-clip-text text-transparent">
            MeshPro
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-200 sm:text-xl">
          Production-ready TypeScript components, a complete Figma design kit, and lifetime
          updates — everything you need to ship polished UIs from day one.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/checkout">
            <Button size="lg" className="min-w-48">
              Get MeshPro — $99
            </Button>
          </Link>
          <a href="#features" className="text-sm font-medium text-brand-200 hover:text-white transition-colors">
            See what's included →
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-brand-300 text-sm">
          {[
            ['2,400+', 'developers'],
            ['50+',    'components'],
            ['4.9★',   'average rating'],
          ].map(([stat, label]) => (
            <div key={stat} className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base">{stat}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code preview card */}
      <div className="relative mx-auto mt-16 max-w-2xl">
        <div className="rounded-xl border border-brand-700/50 bg-brand-950/80 p-4 text-left font-mono text-sm text-brand-200 shadow-2xl backdrop-blur">
          <div className="mb-3 flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <pre className="overflow-auto text-xs leading-relaxed sm:text-sm">{`import { Button, DataTable, Modal } from 'meshpro'

export function UserTable({ users }: { users: User[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Add User
      </Button>
      <DataTable rows={users} columns={columns} />
      <Modal open={open} onClose={() => setOpen(false)}>
        <AddUserForm />
      </Modal>
    </>
  )
}`}</pre>
        </div>
      </div>
    </section>
  )
}
