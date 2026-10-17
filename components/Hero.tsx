import type { MovieDetail } from '@/types/movie'
import PosterImage from './PosterImage'

interface HeroProps {
  movie: MovieDetail
  imdbId: string
}

const BULBS = 28

// Hilera de luces del letrero. En celular se muestran la mitad para que no se amontonen.
function BulbRow({ className }: { className: string }) {
  return (
    <div aria-hidden className={`absolute inset-x-8 flex justify-between sm:inset-x-12 ${className}`}>
      {Array.from({ length: BULBS }, (_, i) => (
        <span key={i} className={`bulb ${i >= BULBS / 2 ? 'max-sm:hidden' : ''}`} />
      ))}
    </div>
  )
}

// Letrero de estreno. Se renderiza en el servidor junto con la página,
// así el título y la sinopsis ya vienen en el HTML inicial.
export default function Hero({ movie, imdbId }: HeroProps) {
  const genres = movie.Genre !== 'N/A' ? movie.Genre.split(', ') : []
  const chips = [movie.Year, movie.Runtime, movie.Rated].filter((value) => value && value !== 'N/A')
  const hasRating = movie.imdbRating !== 'N/A'

  return (
    <section aria-labelledby="hero-title" className="mx-auto w-full max-w-7xl px-4 pt-24 pb-6 sm:px-6 lg:px-8">
      <div className="relative rounded-[2rem] border-[3px] border-acento-1/50 bg-celuloide p-6 sm:p-7">
        <BulbRow className="top-[8px] sm:top-[10px]" />
        <BulbRow className="bottom-[8px] sm:bottom-[10px]" />

        <div className="grid items-center gap-12 rounded-2xl bg-platea px-5 pt-8 pb-12 sm:px-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-14 md:py-14 lg:px-14">
          <div className="order-2 md:order-1">
            <p className="text-sm font-semibold text-acento-1">Estreno destacado</p>
            <h1
              id="hero-title"
              className="mt-3 font-titulo text-4xl leading-[1.02] text-balance text-lavanda sm:text-5xl lg:text-7xl"
            >
              {movie.Title}
            </h1>

            {chips.length > 0 && (
              <ul aria-label="Datos de la película" className="mt-6 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <li key={chip} className="rounded bg-celuloide px-3 py-1 text-sm font-medium text-lavanda/90">
                    {chip}
                  </li>
                ))}
              </ul>
            )}

            {genres.length > 0 && (
              <ul aria-label="Géneros" className="mt-3 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <li key={genre} className="rounded-full border border-acento-1/70 px-3 py-1 text-sm text-acento-1">
                    {genre}
                  </li>
                ))}
              </ul>
            )}

            {movie.Plot !== 'N/A' && (
              <p className="mt-6 line-clamp-3 max-w-[65ch] leading-relaxed text-lavanda/80">{movie.Plot}</p>
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

          <div className="order-1 justify-self-center md:order-2">
            <div className="relative w-40 rotate-3 sm:w-52 lg:w-64">
              <div className="relative aspect-2/3 overflow-hidden rounded-md shadow-[10px_10px_0_0_var(--color-acento-2)]">
                <PosterImage
                  src={movie.Poster}
                  title={movie.Title}
                  preload
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 208px, 256px"
                  className="object-cover"
                />
              </div>

              {hasRating && (
                <div className="ticket degradado-movil absolute -bottom-7 -left-10 grid w-28 -rotate-6 grid-rows-2 rounded-sm text-center font-bold sm:-left-12 sm:w-32">
                  <div className="flex items-center justify-center gap-1.5 px-3 pt-2.5 pb-1.5">
                    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
                    </svg>
                    <span className="font-titulo text-2xl leading-none sm:text-3xl">{movie.imdbRating}</span>
                    <span className="sr-only">de 10 en IMDb</span>
                  </div>
                  <div className="mx-3 flex items-center justify-center border-t-2 border-dashed border-noche/40 pt-1.5 pb-2.5 text-sm font-semibold">
                    {movie.Runtime !== 'N/A' ? movie.Runtime : 'IMDb'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
