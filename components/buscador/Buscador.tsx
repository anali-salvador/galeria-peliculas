'use client'

// Componente cliente (CSR): necesita estado (texto, filtro, resultados), eventos del
// navegador (escribir, hacer clic) y efectos (pedir datos mientras la persona escribe).
import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import type { MovieSummary, SearchResponse } from '@/types/movie'
import MovieCard from '@/components/MovieCard'
import DetalleModal from './DetalleModal'

type Tipo = 'todo' | 'movie' | 'series'

const FILTROS: { valor: Tipo; etiqueta: string }[] = [
  { valor: 'todo', etiqueta: 'Todo' },
  { valor: 'movie', etiqueta: 'Películas' },
  { valor: 'series', etiqueta: 'Series' },
]

const EJEMPLOS = ['Avengers', 'Breaking Bad', 'Titanic', 'Spider-Man', 'Friends']
const MIN_CARACTERES = 2
const ESPERA_MS = 450
const POR_PAGINA = 10 // OMDb devuelve 10 resultados por página

const GRILLA = 'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

function quitarDuplicados(lista: MovieSummary[]): MovieSummary[] {
  return [...new Map(lista.map((movie) => [movie.imdbID, movie])).values()]
}

export default function Buscador() {
  const [texto, setTexto] = useState('')
  const [tipo, setTipo] = useState<Tipo>('todo')
  const [resultados, setResultados] = useState<MovieSummary[]>([])
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seleccionado, setSeleccionado] = useState<string | null>(null)
  const [intento, setIntento] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const consulta = texto.trim()
  const consultaValida = consulta.length >= MIN_CARACTERES

  // Búsqueda en tiempo real: espera a que la persona deje de escribir (debounce)
  // y cancela la petición anterior para que no lleguen respuestas viejas.
  useEffect(() => {
    if (!consultaValida) return

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setCargando(true)
      setError(null)
      try {
        const { data } = await axios.get<SearchResponse>('/api/search', {
          params: { q: consulta, page: pagina, type: tipo === 'todo' ? undefined : tipo },
          signal: controller.signal,
        })
        setResultados((anteriores) =>
          quitarDuplicados(pagina === 1 ? data.results : [...anteriores, ...data.results])
        )
        setTotal(data.totalResults)
        setCargando(false)
      } catch (err) {
        if (axios.isCancel(err)) return
        setError('No pudimos conectar con el catálogo de películas.')
        setCargando(false)
      }
    }, pagina === 1 ? ESPERA_MS : 0)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [consulta, consultaValida, tipo, pagina, intento])

  // Al cambiar el texto o el filtro se reinicia la lista y se vuelve a la página 1
  function reiniciar(nuevoTexto: string) {
    setPagina(1)
    setResultados([])
    setTotal(0)
    setError(null)
    setCargando(nuevoTexto.trim().length >= MIN_CARACTERES)
  }

  function cambiarTexto(valor: string) {
    setTexto(valor)
    reiniciar(valor)
  }

  function cambiarTipo(valor: Tipo) {
    if (valor === tipo) return
    setTipo(valor)
    reiniciar(texto)
  }

  function limpiar() {
    cambiarTexto('')
    inputRef.current?.focus()
  }

  // Referencia estable: el modal la usa en su efecto de foco y teclado
  const cerrarDetalle = useCallback(() => setSeleccionado(null), [])

  function cargarMas() {
    setCargando(true)
    setPagina((actual) => actual + 1)
  }

  function reintentar() {
    setError(null)
    setCargando(true)
    setIntento((actual) => actual + 1)
  }

  const hayMas = resultados.length > 0 && pagina * POR_PAGINA < total
  const sinResultados = consultaValida && !cargando && !error && resultados.length === 0

  return (
    <div>
      <div className="relative">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 left-5 h-6 w-6 -translate-y-1/2 fill-none stroke-acento-1"
          strokeWidth={2.2}
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={texto}
          onChange={(e) => cambiarTexto(e.target.value)}
          aria-label="Buscar películas o series"
          placeholder="Busca una película o serie"
          autoComplete="off"
          className="w-full rounded-2xl border-2 border-platea bg-celuloide py-5 pr-14 pl-14 text-lg text-lavanda transition-[border-color,box-shadow] placeholder:text-lavanda/50 focus:border-acento-1 focus:shadow-[0_0_0_4px_rgb(79_227_224/0.2)] focus-visible:outline-none sm:text-xl"
        />
        {texto && (
          <button
            type="button"
            onClick={limpiar}
            aria-label="Limpiar búsqueda"
            className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-lavanda/70 transition-colors hover:bg-platea hover:text-lavanda"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={2.2} strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>

      <div role="group" aria-label="Filtrar por tipo" className="mt-4 flex flex-wrap gap-2">
        {FILTROS.map((filtro) => {
          const activo = filtro.valor === tipo
          return (
            <button
              key={filtro.valor}
              type="button"
              aria-pressed={activo}
              onClick={() => cambiarTipo(filtro.valor)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activo
                  ? 'degradado-movil'
                  : 'border border-acento-1/50 text-lavanda hover:border-acento-1 hover:text-acento-1'
              }`}
            >
              {filtro.etiqueta}
            </button>
          )
        })}
      </div>

      <p aria-live="polite" className="mt-8 min-h-6 text-sm text-lavanda/80">
        {consultaValida && !error && !(cargando && resultados.length === 0) && total > 0 && (
          <>
            {total} {total === 1 ? 'resultado' : 'resultados'} para «{consulta}»
          </>
        )}
        {consultaValida && cargando && resultados.length === 0 && <>Buscando «{consulta}»</>}
      </p>

      <div className="mt-4">
        {!consultaValida && (
          <EstadoMensaje titulo={consulta.length === 0 ? '¿Qué quieres ver hoy?' : 'Sigue escribiendo'}>
            <p>
              {consulta.length === 0
                ? 'Escribe el nombre de una película o serie y los resultados aparecerán mientras escribes.'
                : `Escribe al menos ${MIN_CARACTERES} letras para empezar a buscar.`}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="w-full text-sm text-lavanda/70">Prueba con</span>
              {EJEMPLOS.map((ejemplo) => (
                <button
                  key={ejemplo}
                  type="button"
                  onClick={() => cambiarTexto(ejemplo)}
                  className="rounded-full border border-acento-1/50 px-4 py-1.5 text-sm font-medium text-acento-1 transition-colors hover:border-acento-1 hover:bg-acento-1/10"
                >
                  {ejemplo}
                </button>
              ))}
            </div>
          </EstadoMensaje>
        )}

        {error && (
          <EstadoMensaje titulo="Algo salió mal">
            <p>{error} Revisa tu conexión y vuelve a intentarlo.</p>
            <button
              type="button"
              onClick={reintentar}
              className="degradado-movil mt-6 rounded-md px-6 py-3 font-bold transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Intentar de nuevo
            </button>
          </EstadoMensaje>
        )}

        {sinResultados && (
          <EstadoMensaje titulo="No encontramos nada">
            <p>
              No hay {tipo === 'movie' ? 'películas' : tipo === 'series' ? 'series' : 'títulos'} que coincidan con «
              {consulta}». Revisa cómo está escrito, prueba con el título en inglés
              {tipo !== 'todo' ? ' o busca en todos los tipos' : ' o usa una palabra más específica'}.
            </p>
          </EstadoMensaje>
        )}

        {consultaValida && !error && (resultados.length > 0 || cargando) && (
          <ul className={GRILLA}>
            {resultados.map((movie) => (
              <li key={movie.imdbID}>
                <button
                  type="button"
                  onClick={() => setSeleccionado(movie.imdbID)}
                  aria-label={`Ver detalle de ${movie.Title}`}
                  className="group block w-full rounded-md text-left"
                >
                  <MovieCard movie={movie} variant="grilla" />
                </button>
              </li>
            ))}
            {cargando &&
              Array.from({ length: resultados.length === 0 ? 12 : 6 }, (_, i) => (
                <li key={`esqueleto-${i}`} aria-hidden>
                  <TarjetaEsqueleto />
                </li>
              ))}
          </ul>
        )}

        {hayMas && !cargando && !error && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={cargarMas}
              className="rounded-md border-2 border-acento-1 px-6 py-3 font-bold text-acento-1 transition hover:-translate-y-0.5 hover:bg-acento-1/10"
            >
              Cargar más
            </button>
          </div>
        )}
      </div>

      {seleccionado && <DetalleModal imdbId={seleccionado} onClose={cerrarDetalle} />}
    </div>
  )
}

function EstadoMensaje({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-acento-1/15 bg-celuloide/70 px-6 py-12 text-center text-lavanda/80">
      <h2 className="font-titulo text-2xl text-lavanda sm:text-3xl">{titulo}</h2>
      <div className="mx-auto mt-3 max-w-[65ch]">{children}</div>
    </div>
  )
}

// Misma estructura y tamaño que MovieCard para que la grilla no salte al cargar
function TarjetaEsqueleto() {
  return (
    <div>
      <div className="esqueleto aspect-2/3 rounded-md" />
      <div className="esqueleto ticket mt-2 rounded-sm px-4 py-3">
        <div className="min-h-[2lh] text-sm leading-snug" />
        <div className="mt-1 text-xs">&nbsp;</div>
      </div>
    </div>
  )
}
