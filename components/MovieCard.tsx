import type { MovieSummary } from '@/types/movie'
import PosterImage from './PosterImage'

interface MovieCardProps {
  movie: MovieSummary
  // tira: tarjeta de ancho fijo con enlace a IMDb (página principal).
  // grilla: solo el contenido visual, para envolverla en un botón (búsqueda).
  variant?: 'tira' | 'grilla'
}

export default function MovieCard({ movie, variant = 'tira' }: MovieCardProps) {
  // Dentro de un botón solo se permite contenido en línea, por eso se usan span
  const Titulo = variant === 'tira' ? 'h3' : 'span'

  // El elemento que envuelve la tarjeta (enlace o botón) lleva la clase "group"
  const card = (
    <span className="block transition-transform duration-200 group-hover:-translate-y-1.5 group-hover:-rotate-1 group-focus-visible:-translate-y-1.5 group-focus-visible:-rotate-1">
      <span className="relative block aspect-2/3 overflow-hidden rounded-md border-[3px] border-platea bg-platea transition-colors duration-200 group-hover:border-acento-1 group-focus-visible:border-acento-1">
        <PosterImage
          src={movie.Poster}
          title={movie.Title}
          sizes={
            variant === 'tira'
              ? '(max-width: 640px) 160px, (max-width: 1024px) 176px, 208px'
              : '(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw'
          }
          className="object-cover"
        />
      </span>

      <span className="ticket degradado-movil mt-2 block rounded-sm px-4 py-3">
        <Titulo className="line-clamp-2 min-h-[2lh] font-titulo text-sm leading-snug" title={movie.Title}>
          {movie.Title}
        </Titulo>
        <span className="mt-1 block text-xs font-bold">{movie.Year}</span>
      </span>
    </span>
  )

  if (variant === 'grilla') return card

  return (
    <article className="w-40 shrink-0 snap-start sm:w-44 lg:w-52">
      <a
        href={`https://www.imdb.com/title/${movie.imdbID}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-md"
      >
        {card}
      </a>
    </article>
  )
}
