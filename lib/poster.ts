// OMDb devuelve "N/A" cuando no hay póster. Solo aceptamos el host configurado en next.config.ts.
export function hasPoster(poster: string): boolean {
  return poster.startsWith('https://m.media-amazon.com/')
}
