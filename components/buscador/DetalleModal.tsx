'use client'

// Componente cliente (CSR): pide el detalle cuando la persona abre el modal y usa
// eventos del navegador (teclado, foco, scroll del body) que no existen en el servidor.
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import type { MovieDetail } from '@/types/movie'
import PosterImage from '@/components/PosterImage'

interface DetalleModalProps {
  imdbId: string
  onClose: () => void
}

const TIPOS: Record<string, string> = {
  movie: 'Película',
  series: 'Serie',
  episode: 'Episodio',
  game: 'Videojuego',
}

const SELECTOR_ENFOCABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

// OMDb usa "N/A" cuando no tiene el dato
function dato(valor: string | undefined): string | null {
  return valor && valor !== 'N/A' ? valor : null
}

export default function DetalleModal({ imdbId, onClose }: DetalleModalProps) {
  const [detalle, setDetalle] = useState<MovieDetail | null>(null)
  const [error, setError] = useState(false)
  const [intento, setIntento] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const cerrarRef = useRef<HTMLButtonElement>(null)

  // Pide el detalle a nuestra ruta; si el modal se cierra antes, se cancela la petición
  useEffect(() => {
    const controller = new AbortController()

    async function cargar() {
      try {
        const { data } = await axios.get<MovieDetail>(`/api/movie/${imdbId}`, { signal: controller.signal })
        setDetalle(data)
      } catch (err) {
        if (!axios.isCancel(err)) setError(true)
      }
    }
    cargar()

    return () => controller.abort()
  }, [imdbId, intento])

  // Al abrir: bloquea el scroll del body, lleva el foco a "Cerrar" y escucha Escape.
  // Al cerrar: devuelve el foco al elemento que abrió el modal.
  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cerrarRef.current?.focus()

    function alPresionar(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', alPresionar)

    return () => {
      document.removeEventListener('keydown', alPresionar)
      document.body.style.overflow = overflowAnterior
      previo?.focus()
    }
  }, [onClose])

  // Mantiene el foco dentro del modal al usar Tab y Shift+Tab
  function atraparFoco(e: React.KeyboardEvent) {
    if (e.key !== 'Tab' || !panelRef.current) return
    const enfocables = [...panelRef.current.querySelectorAll<HTMLElement>(SELECTOR_ENFOCABLES)]
    if (enfocables.length === 0) return
    const primero = enfocables[0]
    const ultimo = enfocables[enfocables.length - 1]

    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault()
      ultimo.focus()
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault()
      primero.focus()
    }
  }

  function reintentar() {
    setError(false)
    setDetalle(null)
    setIntento((actual) => actual + 1)
  }

  return (
    <div
      className="modal-fondo fixed inset-0 z-[60] flex items-end justify-center bg-celuloide/80 backdrop-blur-md sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-titulo"
        onKeyDown={atraparFoco}
        className="modal-panel relative max-h-[92dvh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-2xl border border-acento-1/20 bg-platea shadow-2xl shadow-black/50 sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex justify-end bg-linear-to-b from-platea via-platea/90 to-transparent p-3 sm:p-4">
          <button
            ref={cerrarRef}
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-md bg-celuloide px-4 py-2 text-sm font-semibold text-lavanda transition-colors hover:text-acento-1"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2.4} strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
            Cerrar
          </button>
        </div>

        <div className="px-5 pb-8 sm:px-8 sm:pb-10">
          {error ? (
            <div className="py-12 text-center">
              <h2 id="detalle-titulo" className="font-titulo text-2xl text-lavanda">
                No pudimos cargar el detalle
              </h2>
              <p className="mx-auto mt-3 max-w-[65ch] text-lavanda/80">
                Hubo un problema al consultar la información de este título. Vuelve a intentarlo en un momento.
              </p>
              <button
                type="button"
                onClick={reintentar}
                className="degradado-movil mt-6 rounded-md px-6 py-3 font-bold transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : detalle ? (
            <Contenido detalle={detalle} imdbId={imdbId} />
          ) : (
            <Esqueleto />
          )}
        </div>
      </div>
    </div>
  )
}

function Contenido({ detalle, imdbId }: { detalle: MovieDetail; imdbId: string }) {
  const chips = [dato(detalle.Year), dato(detalle.Rated), dato(detalle.Runtime), TIPOS[detalle.Type] ?? dato(detalle.Type)].filter(
    (valor): valor is string => Boolean(valor)
  )
  const generos = dato(detalle.Genre)?.split(', ') ?? []
  const rating = dato(detalle.imdbRating)
  const votos = dato(detalle.imdbVotes)

  const ficha = [
    { etiqueta: 'Dirección', valor: dato(detalle.Director) },
    { etiqueta: 'Guion', valor: dato(detalle.Writer) },
    { etiqueta: 'Reparto', valor: dato(detalle.Actors) },
    { etiqueta: 'Idiomas', valor: dato(detalle.Language) },
    { etiqueta: 'País', valor: dato(detalle.Country) },
    { etiqueta: 'Premios', valor: dato(detalle.Awards) },
  ].filter((fila): fila is { etiqueta: string; valor: string } => Boolean(fila.valor))

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:gap-10">
      <div className="flex flex-col items-center gap-10 md:items-stretch">
        <div className="relative aspect-2/3 w-48 overflow-hidden rounded-md shadow-[8px_8px_0_0_var(--color-acento-2)] sm:w-56 md:w-full">
          <PosterImage src={detalle.Poster} title={detalle.Title} sizes="(max-width: 768px) 224px, 272px" className="object-cover" />
        </div>

        {rating && (
          <div className="ticket degradado-movil grid w-44 grid-rows-2 rounded-sm text-center font-bold md:w-full">
            <div className="flex items-center justify-center gap-2 px-4 pt-3 pb-2">
              <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
              </svg>
              <span className="font-titulo text-3xl leading-none">{rating}</span>
              <span className="text-sm">/10</span>
              <span className="sr-only">en IMDb</span>
            </div>
            <div className="mx-4 flex items-center justify-center border-t-2 border-dashed border-noche/40 pt-2 pb-3 text-sm">
              {votos ? `${votos} votos en IMDb` : 'Calificación IMDb'}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 id="detalle-titulo" className="font-titulo text-3xl leading-[1.05] text-balance text-lavanda sm:text-4xl lg:text-5xl">
          {detalle.Title}
        </h2>

        {chips.length > 0 && (
          <ul aria-label="Datos generales" className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip} className="rounded bg-celuloide px-3 py-1 text-sm font-medium text-lavanda/90">
                {chip}
              </li>
            ))}
          </ul>
        )}

        {generos.length > 0 && (
          <ul aria-label="Géneros" className="mt-3 flex flex-wrap gap-2">
            {generos.map((genero) => (
              <li key={genero} className="rounded-full border border-acento-1/70 px-3 py-1 text-sm text-acento-1">
                {genero}
              </li>
            ))}
          </ul>
        )}

        {dato(detalle.Plot) && <p className="mt-6 max-w-[65ch] leading-relaxed text-lavanda/85">{detalle.Plot}</p>}

        {ficha.length > 0 && (
          <dl className="mt-8 grid gap-x-6 gap-y-4 border-t-2 border-dashed border-acento-1/25 pt-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-baseline">
            {ficha.map((fila) => (
              <div key={fila.etiqueta} className="contents">
                <dt className="text-sm font-semibold text-acento-1">{fila.etiqueta}</dt>
                <dd className="-mt-3 max-w-[65ch] text-lavanda/85 sm:mt-0">{fila.valor}</dd>
              </div>
            ))}
          </dl>
        )}

        <a
          href={`https://www.imdb.com/title/${imdbId}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="degradado-movil mt-8 inline-block rounded-md px-6 py-3 font-bold transition hover:-translate-y-0.5 hover:brightness-110"
        >
          Ver en IMDb
        </a>
      </div>
    </div>
  )
}

function Esqueleto() {
  return (
    <div aria-busy="true" className="grid gap-8 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:gap-10">
      <h2 id="detalle-titulo" className="sr-only">
        Cargando detalle
      </h2>
      <div className="esqueleto mx-auto aspect-2/3 w-48 rounded-md sm:w-56 md:w-full" />
      <div className="space-y-4">
        <div className="esqueleto h-10 w-3/4 rounded" />
        <div className="flex gap-2">
          <div className="esqueleto h-7 w-16 rounded" />
          <div className="esqueleto h-7 w-16 rounded" />
          <div className="esqueleto h-7 w-20 rounded" />
        </div>
        <div className="space-y-2 pt-4">
          <div className="esqueleto h-4 w-full rounded" />
          <div className="esqueleto h-4 w-full rounded" />
          <div className="esqueleto h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
  )
}
