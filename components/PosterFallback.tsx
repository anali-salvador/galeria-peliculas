interface PosterFallbackProps {
  title: string
}

// Póster de reemplazo cuando no hay imagen o la imagen no carga.
// Usa span para poder ir dentro de botones (tarjetas de la búsqueda).
export default function PosterFallback({ title }: PosterFallbackProps) {
  return (
    <span
      role="img"
      aria-label={`Sin póster: ${title}`}
      className="flex h-full flex-col items-center justify-center gap-4 bg-platea p-4 text-center"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-10 w-10 fill-acento-1">
        <path d="M3.2 6.6 19.6 2.2l.9 3.2L4.1 9.8z" />
        <path d="M3 11h18v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      </svg>
      <span className="line-clamp-4 font-titulo text-base leading-snug text-lavanda">{title}</span>
    </span>
  )
}
