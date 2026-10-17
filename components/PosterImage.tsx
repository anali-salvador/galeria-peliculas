'use client'

// Componente cliente: necesita el evento onError del navegador para detectar
// pósters que OMDb lista pero que ya no existen (404) y mostrar el reemplazo.
import { useState } from 'react'
import Image from 'next/image'
import { hasPoster } from '@/lib/poster'
import PosterFallback from './PosterFallback'

interface PosterImageProps {
  src: string
  title: string
  sizes: string
  className?: string
  preload?: boolean
}

export default function PosterImage({ src, title, sizes, className, preload }: PosterImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed || !hasPoster(src)) return <PosterFallback title={title} />

  return (
    <Image
      src={src}
      alt={`Póster de ${title}`}
      fill
      sizes={sizes}
      preload={preload}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
