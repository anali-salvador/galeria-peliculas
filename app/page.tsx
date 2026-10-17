import { connection } from 'next/server'
import { getMovieById, searchMovies } from '@/lib/omdb'
import { hasPoster } from '@/lib/poster'
import type { MovieSummary } from '@/types/movie'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MovieRow from '@/components/MovieRow'
import Footer from '@/components/Footer'

const FEATURED_ID = 'tt4154796'

// OMDb no tiene endpoint de populares: usamos búsquedas de sagas conocidas
const SECTIONS = [
  { query: 'marvel', title: 'Universo Marvel' },
  { query: 'batman', title: 'Batman' },
  { query: 'star wars', title: 'Star Wars' },
  { query: 'harry potter', title: 'Harry Potter' },
]

// Página SSR: componente async de servidor, no es un componente de cliente.
// Los datos se piden en el servidor para que el contenido inicial llegue
// listo en el HTML y sea visible para buscadores, y la API key nunca sale al navegador.
export default async function Home() {
  // Marca la página como dinámica: se renderiza en cada petición, no en el build
  await connection()

  // Todas las peticiones a OMDb en paralelo. allSettled: si una falla, las demás siguen.
  const [featuredResult, ...searchResults] = await Promise.allSettled([
    getMovieById(FEATURED_ID),
    ...SECTIONS.map((section) => searchMovies(section.query)),
  ])

  const featured = featuredResult.status === 'fulfilled' ? featuredResult.value : null

  // Quita duplicados entre secciones y películas sin póster; omite secciones que fallaron o quedaron vacías
  const seen = new Set<string>()
  const rows = SECTIONS.flatMap((section, i) => {
    const result = searchResults[i]
    if (result.status === 'rejected') return []

    const movies = (result.value as MovieSummary[]).filter((movie) => {
      if (!hasPoster(movie.Poster) || seen.has(movie.imdbID)) return false
      seen.add(movie.imdbID)
      return true
    })

    return movies.length > 0 ? [{ title: section.title, movies }] : []
  })

  const nothingLoaded = !featured && rows.length === 0

  return (
    <>
      <Navbar active="inicio" />
      <main className="flex-1">
        {featured ? <Hero movie={featured} imdbId={FEATURED_ID} /> : <div className="h-16" />}

        {nothingLoaded ? (
          <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
            <span aria-hidden className="text-6xl">🍿</span>
            <h1 className="mt-6 font-titulo text-3xl text-lavanda">
              La función se retrasó un poco
            </h1>
            <p className="mt-3 max-w-[65ch] text-lavanda/80">
              No pudimos cargar las películas en este momento. Vuelve a intentarlo en unos minutos.
            </p>
          </div>
        ) : (
          <div className="pt-4 pb-4">
            {rows.map((row) => (
              <MovieRow key={row.title} title={row.title} movies={row.movies} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
