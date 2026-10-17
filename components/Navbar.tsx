import Link from 'next/link'

interface NavbarProps {
  // Cada página indica su sección, así la barra sigue siendo componente de servidor
  active?: 'inicio' | 'buscar'
}

export default function Navbar({ active }: NavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-acento-1/15 bg-noche/80 backdrop-blur-md">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2 rounded-sm text-acento-1">
          <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-current sm:h-6 sm:w-6">
            <path d="M3.2 6.6 19.6 2.2l.9 3.2L4.1 9.8z" />
            <path d="M3 11h18v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
          </svg>
          <span className="font-titulo text-base sm:text-xl">CineGalería</span>
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-6">
          <Link
            href="/"
            aria-current={active === 'inicio' ? 'page' : undefined}
            className="enlace-activo rounded-sm text-sm font-semibold text-lavanda transition-colors hover:text-acento-1"
          >
            Inicio
          </Link>
          <Link
            href="/buscar"
            aria-current={active === 'buscar' ? 'page' : undefined}
            className="degradado-movil rounded-md px-2.5 py-2 text-sm font-bold whitespace-nowrap transition hover:-translate-y-0.5 hover:brightness-110 aria-[current=page]:ring-2 aria-[current=page]:ring-lavanda/70 aria-[current=page]:ring-offset-2 aria-[current=page]:ring-offset-noche sm:px-4"
          >
            Buscar película
          </Link>
        </div>
      </nav>
    </header>
  )
}
