import type { MovieSummary } from '@/types/movie'
import MovieCard from './MovieCard'

interface MovieRowProps {
  title: string
  movies: MovieSummary[]
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const headingId = `seccion-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <section aria-labelledby={headingId} className="py-6">
      <div className="mx-auto mb-4 flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 sm:px-6 lg:px-8">
        <h2 id={headingId} className="font-titulo text-2xl text-lavanda sm:text-3xl">
          {title}
        </h2>
        <span className="rounded-full border border-acento-1/70 px-3 py-0.5 text-xs font-medium text-acento-1">
          Renderizado en el servidor (SSR)
        </span>
      </div>

      <div className="filmstrip">
        <div
          tabIndex={0}
          role="region"
          aria-label={`Películas de ${title}`}
          className="filmstrip-track flex snap-x snap-mandatory gap-4 overflow-x-auto py-3 sm:gap-5"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-celuloide to-transparent sm:w-20" />
      </div>
    </section>
  )
}
