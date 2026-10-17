import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Buscador from '@/components/buscador/Buscador'

export const metadata: Metadata = {
  title: 'Buscar películas | CineGalería',
  description: 'Busca películas y series en tiempo real y mira su ficha completa.',
}

// Página de servidor: el título y la estructura llegan en el HTML.
// Solo la parte interactiva (Buscador) es componente de cliente.
export default function BuscarPage() {
  return (
    <>
      <Navbar active="buscar" />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-28 pb-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <h1 className="font-titulo text-4xl text-lavanda sm:text-5xl">Buscar películas</h1>
            <span className="rounded-full border border-acento-1/70 px-3 py-0.5 text-xs font-medium text-acento-1">
              Renderizado en el navegador (CSR)
            </span>
          </div>
          <p className="mt-3 max-w-[65ch] text-lavanda/80">
            Encuentra cualquier película o serie y abre su ficha completa sin salir de esta página.
          </p>
        </header>

        <Buscador />
      </main>
      <Footer />
    </>
  )
}
